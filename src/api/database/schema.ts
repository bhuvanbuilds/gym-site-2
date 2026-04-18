import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Leads from landing page form
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  goal: text("goal").notNull(), // weight_loss | muscle_gain | general_fitness
  status: text("status").notNull().default("new"), // new | contacted | converted | lost
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(""),
});

// Members
export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  plan: text("plan").notNull().default("basic"), // basic | standard | premium
  status: text("status").notNull().default("active"), // active | expired | suspended
  joinDate: text("join_date").notNull().default(""),
  expiryDate: text("expiry_date").notNull().default(""),
  photo: text("photo"),
  createdAt: text("created_at").notNull().default(""),
});

// Attendance
export const attendance = sqliteTable("attendance", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  memberId: integer("member_id").notNull().references(() => members.id),
  date: text("date").notNull(), // YYYY-MM-DD
  markedAt: text("marked_at").notNull().default(""),
});

// Admin users
export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  planExpiry: text("plan_expiry").notNull().default(""),
  createdAt: text("created_at").notNull().default(""),
});
