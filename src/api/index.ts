import { Hono } from 'hono';
import { cors } from "hono/cors";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { leads, members, attendance, admins } from "./database/schema";

type Bindings = { DB: D1Database };

const app = new Hono<{ Bindings: Bindings }>().basePath('api');

app.use(cors({ origin: "*", credentials: true }));

// ── Helpers ──────────────────────────────────────────────────────────────────

function now() { return new Date().toISOString(); }
function today() { return new Date().toISOString().slice(0, 10); }

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "gymapp_salt_2024");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getAdmin(c: any) {
  const db = drizzle(c.env.DB);
  const sessionId = getCookie(c, "admin_session");
  if (!sessionId) return null;
  // Session format: adminId:timestamp:hash
  const parts = sessionId.split(":");
  if (parts.length !== 2) return null;
  const adminId = parseInt(parts[0]);
  const adminList = await db.select().from(admins).where(eq(admins.id, adminId));
  const admin = adminList[0];
  if (!admin) return null;
  // Check plan expiry
  if (admin.planExpiry && new Date(admin.planExpiry) < new Date()) return null;
  return admin;
}

// ── Ping ─────────────────────────────────────────────────────────────────────

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

// ── Auth ──────────────────────────────────────────────────────────────────────

app.post('/auth/login', async (c) => {
  const db = drizzle(c.env.DB);
  const { username, password } = await c.req.json();
  if (!username || !password) return c.json({ error: "Missing credentials" }, 400);

  const hash = await hashPassword(password);
  const adminList = await db.select().from(admins).where(
    and(eq(admins.username, username), eq(admins.passwordHash, hash))
  );
  const admin = adminList[0];
  if (!admin) return c.json({ error: "Invalid credentials" }, 401);
  if (admin.planExpiry && new Date(admin.planExpiry) < new Date()) {
    return c.json({ error: "Admin plan expired" }, 403);
  }

  const sessionValue = `${admin.id}:${Date.now()}`;
  setCookie(c, "admin_session", sessionValue, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "Lax",
  });
  return c.json({ success: true, username: admin.username, planExpiry: admin.planExpiry });
});

app.post('/auth/logout', (c) => {
  deleteCookie(c, "admin_session", { path: "/" });
  return c.json({ success: true });
});

app.get('/auth/me', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ authenticated: false }, 401);
  return c.json({ authenticated: true, username: admin.username, planExpiry: admin.planExpiry });
});

// ── Setup (create first admin) ────────────────────────────────────────────────

app.post('/auth/setup', async (c) => {
  const db = drizzle(c.env.DB);
  const existing = await db.select().from(admins);
  if (existing.length > 0) return c.json({ error: "Admin already exists" }, 400);

  const hash = await hashPassword("admin123");
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 10); // 10 year expiry by default

  await db.insert(admins).values({
    username: "admin",
    passwordHash: hash,
    planExpiry: expiry.toISOString(),
    createdAt: now(),
  });
  return c.json({ success: true, message: "Admin created: admin / admin123" });
});

// ── Leads ─────────────────────────────────────────────────────────────────────

app.post('/leads', async (c) => {
  const db = drizzle(c.env.DB);
  const { name, phone, goal } = await c.req.json();
  if (!name || !phone || !goal) return c.json({ error: "Missing fields" }, 400);

  await db.insert(leads).values({ name, phone, goal, status: "new", createdAt: now() });
  return c.json({ success: true, message: "We'll contact you shortly!" });
});

app.get('/leads', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const all = await db.select().from(leads).orderBy(desc(leads.createdAt));
  return c.json(all);
});

app.patch('/leads/:id', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  await db.update(leads).set(body).where(eq(leads.id, id));
  return c.json({ success: true });
});

app.delete('/leads/:id', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));
  await db.delete(leads).where(eq(leads.id, id));
  return c.json({ success: true });
});

// ── Members ───────────────────────────────────────────────────────────────────

app.get('/members', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const all = await db.select().from(members).orderBy(desc(members.createdAt));
  return c.json(all);
});

app.get('/members/expiring', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const all = await db.select().from(members).where(
    and(
      gte(members.expiryDate, today()),
      lte(members.expiryDate, sevenDaysLater.toISOString().slice(0, 10))
    )
  );
  return c.json(all);
});

app.get('/members/lookup', async (c) => {
  const phone = c.req.query("phone");
  if (!phone) return c.json({ error: "Phone required" }, 400);

  const db = drizzle(c.env.DB);
  const memberList = await db.select().from(members).where(eq(members.phone, phone));
  const member = memberList[0];
  if (!member) return c.json({ error: "Member not found" }, 404);
  return c.json(member);
});

app.post('/members', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const { name, phone, email, plan, joinDate, expiryDate } = body;
  if (!name || !phone || !plan) return c.json({ error: "Missing fields" }, 400);

  await db.insert(members).values({
    name, phone, email: email || null, plan,
    status: "active",
    joinDate: joinDate || today(),
    expiryDate: expiryDate || "",
    createdAt: now(),
  });
  return c.json({ success: true });
});

app.patch('/members/:id', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));
  const body = await c.req.json();
  await db.update(members).set(body).where(eq(members.id, id));
  return c.json({ success: true });
});

app.delete('/members/:id', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));
  await db.delete(attendance).where(eq(attendance.memberId, id));
  await db.delete(members).where(eq(members.id, id));
  return c.json({ success: true });
});

// ── Attendance ────────────────────────────────────────────────────────────────

// Member marks own attendance via phone
app.post('/attendance/mark', async (c) => {
  const db = drizzle(c.env.DB);
  const { phone } = await c.req.json();
  if (!phone) return c.json({ error: "Phone required" }, 400);

  const memberList = await db.select().from(members).where(eq(members.phone, phone));
  const member = memberList[0];
  if (!member) return c.json({ error: "Member not found" }, 404);
  if (member.status !== "active") return c.json({ error: "Membership not active" }, 403);
  if (member.expiryDate && member.expiryDate < today()) {
    await db.update(members).set({ status: "expired" }).where(eq(members.id, member.id));
    return c.json({ error: "Membership expired" }, 403);
  }

  // Check already marked today
  const existing = await db.select().from(attendance).where(
    and(eq(attendance.memberId, member.id), eq(attendance.date, today()))
  );
  if (existing.length > 0) return c.json({ error: "Already marked today", alreadyMarked: true }, 409);

  await db.insert(attendance).values({
    memberId: member.id,
    date: today(),
    markedAt: now(),
  });
  return c.json({ success: true, member: { name: member.name, plan: member.plan, expiryDate: member.expiryDate } });
});

// Get attendance history for a member (by phone)
app.get('/attendance/history', async (c) => {
  const phone = c.req.query("phone");
  if (!phone) return c.json({ error: "Phone required" }, 400);

  const db = drizzle(c.env.DB);
  const memberList = await db.select().from(members).where(eq(members.phone, phone));
  const member = memberList[0];
  if (!member) return c.json({ error: "Member not found" }, 404);

  const history = await db.select().from(attendance)
    .where(eq(attendance.memberId, member.id))
    .orderBy(desc(attendance.date));

  return c.json({ member, attendance: history });
});

// Admin: get all attendance
app.get('/attendance', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const date = c.req.query("date") || today();
  const all = await db.select({
    id: attendance.id,
    date: attendance.date,
    markedAt: attendance.markedAt,
    memberId: attendance.memberId,
    memberName: members.name,
    memberPhone: members.phone,
    memberPlan: members.plan,
  }).from(attendance)
    .innerJoin(members, eq(attendance.memberId, members.id))
    .where(eq(attendance.date, date))
    .orderBy(desc(attendance.markedAt));
  return c.json(all);
});

// Admin marks attendance for member
app.post('/attendance/admin-mark', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);
  const { memberId, date } = await c.req.json();
  const targetDate = date || today();

  const existing = await db.select().from(attendance).where(
    and(eq(attendance.memberId, memberId), eq(attendance.date, targetDate))
  );
  if (existing.length > 0) return c.json({ error: "Already marked" }, 409);

  await db.insert(attendance).values({ memberId, date: targetDate, markedAt: now() });
  return c.json({ success: true });
});

// ── Dashboard Stats ───────────────────────────────────────────────────────────

app.get('/stats', async (c) => {
  const admin = await getAdmin(c);
  if (!admin) return c.json({ error: "Unauthorized" }, 401);

  const db = drizzle(c.env.DB);

  const [totalMembers] = await db.select({ count: sql<number>`count(*)` }).from(members);
  const [activeMembers] = await db.select({ count: sql<number>`count(*)` }).from(members).where(eq(members.status, "active"));
  const [expiredMembers] = await db.select({ count: sql<number>`count(*)` }).from(members).where(eq(members.status, "expired"));
  const [totalLeads] = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const [newLeads] = await db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, "new"));
  const [todayAttendance] = await db.select({ count: sql<number>`count(*)` }).from(attendance).where(eq(attendance.date, today()));

  // Expiring in 7 days
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
  const [expiringMembers] = await db.select({ count: sql<number>`count(*)` }).from(members).where(
    and(
      gte(members.expiryDate, today()),
      lte(members.expiryDate, sevenDaysLater.toISOString().slice(0, 10)),
      eq(members.status, "active")
    )
  );

  // Last 7 days attendance trend
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const [row] = await db.select({ count: sql<number>`count(*)` }).from(attendance).where(eq(attendance.date, dateStr));
    trend.push({ date: dateStr, count: Number(row.count) });
  }

  return c.json({
    totalMembers: Number(totalMembers.count),
    activeMembers: Number(activeMembers.count),
    expiredMembers: Number(expiredMembers.count),
    totalLeads: Number(totalLeads.count),
    newLeads: Number(newLeads.count),
    todayAttendance: Number(todayAttendance.count),
    expiringMembers: Number(expiringMembers.count),
    attendanceTrend: trend,
  });
});

export default app;
