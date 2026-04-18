export default function Marquee() {
  const items = [
    "Weight Loss", "★", "Muscle Gain", "★", "Personal Training", "★",
    "HIIT", "★", "Nutrition Coaching", "★", "Body Transformation", "★",
    "Weight Loss", "★", "Muscle Gain", "★", "Personal Training", "★",
    "HIIT", "★", "Nutrition Coaching", "★", "Body Transformation", "★",
  ];

  return (
    <div className="overflow-hidden border-y border-white/[0.06] bg-[#E8FF00]/[0.03] py-3.5">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className={`px-5 whitespace-nowrap display-upright text-sm ${
            item === "★" ? "text-[#E8FF00]" : "text-[#555] hover:text-[#888] transition-colors"
          }`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
