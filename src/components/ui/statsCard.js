const StatsCard = ({
  title,
  value,
  icon: CardIcon,
  gradientFrom = "#6366f1",
  gradientTo = "#818cf8",
  glowColor = "rgba(99,102,241,0.05)",
  shadowColor = "rgba(99,102,241,0.2)",
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-(--color-card-bg) border border-(--color-card-border) shadow-(--shadow-sm) p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:translate-y-[-4px] hover:shadow-(--shadow-md) hover:border-(--color-border-dark)">
      <div
        className="absolute -right-2.5 -top-2.5 h-16 w-16 rounded-full sm:h-20 sm:w-20 transition-transform duration-500 group-hover:scale-150"
        style={{ backgroundColor: glowColor }}
      />

      <div className="flex items-center gap-3 sm:gap-3.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11.5 sm:w-11.5 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            boxShadow: `0 4px 10px ${shadowColor}`,
          }}
        >
          <CardIcon className="text-xl text-(--color-white) sm:text-[22px]" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-(--color-text-muted) sm:text-xs">
            {title}
          </p>

          <h3 className="mt-0.5 text-2xl font-extrabold text-(--color-text-primary) sm:text-[26px]">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;