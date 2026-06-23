import type { InvestorMode } from "@/lib/scoring";

type AvatarSize = "sm" | "lg";

type AvatarProfile = {
  initials: string;
  label: string;
  accent: string;
  glow: string;
  motif: "shield" | "bolt" | "builder" | "cycle" | "value";
};

const avatarProfiles: Record<Exclude<InvestorMode, "Custom">, AvatarProfile> = {
  "Rick Rule": {
    initials: "RR",
    label: "Survival-first allocator",
    accent: "#9de58b",
    glow: "rgba(157, 229, 139, 0.24)",
    motif: "shield"
  },
  "Eric Sprott": {
    initials: "ES",
    label: "High-torque speculator",
    accent: "#f4c167",
    glow: "rgba(244, 193, 103, 0.24)",
    motif: "bolt"
  },
  "Ross Beaty": {
    initials: "RB",
    label: "Mine builder",
    accent: "#67e8f9",
    glow: "rgba(103, 232, 249, 0.22)",
    motif: "builder"
  },
  "Tavi Costa": {
    initials: "TC",
    label: "Macro cycle analyst",
    accent: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.24)",
    motif: "cycle"
  },
  "Lobo Tigre": {
    initials: "LT",
    label: "Contrarian value hunter",
    accent: "#fb7185",
    glow: "rgba(251, 113, 133, 0.22)",
    motif: "value"
  }
};

function Motif({ profile, size }: { profile: AvatarProfile; size: AvatarSize }) {
  const strokeWidth = size === "lg" ? 7 : 9;
  const common = {
    fill: "none",
    stroke: profile.accent,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth
  };

  if (profile.motif === "shield") {
    return <path {...common} d="M50 16 78 28v20c0 19-11 32-28 40-17-8-28-21-28-40V28l28-12Z" />;
  }

  if (profile.motif === "bolt") {
    return <path {...common} d="M56 12 27 55h20l-5 33 31-46H53l3-30Z" />;
  }

  if (profile.motif === "builder") {
    return (
      <>
        <path {...common} d="M22 78h56" />
        <path {...common} d="M31 78V43l19-16 19 16v35" />
        <path {...common} d="M42 78V58h16v20" />
      </>
    );
  }

  if (profile.motif === "cycle") {
    return (
      <>
        <path {...common} d="M73 37a27 27 0 0 0-46-7" />
        <path {...common} d="M27 30h20M27 30V10" />
        <path {...common} d="M27 63a27 27 0 0 0 46 7" />
        <path {...common} d="M73 70H53M73 70v20" />
      </>
    );
  }

  return (
    <>
      <path {...common} d="M25 31h50" />
      <path {...common} d="M33 31 50 78l17-47" />
      <path {...common} d="M38 52h24" />
    </>
  );
}

export function InvestorAvatar({
  mode,
  size = "lg",
  matchPercent
}: {
  mode: Exclude<InvestorMode, "Custom">;
  size?: AvatarSize;
  matchPercent?: number;
}) {
  const profile = avatarProfiles[mode];
  const dimensions = size === "lg" ? "h-24 w-24" : "h-10 w-10";
  const initialsClass = size === "lg" ? "text-xl" : "text-[11px]";

  return (
    <div className="group flex shrink-0 flex-col items-center gap-2">
      <div
        className={`${dimensions} relative overflow-hidden rounded-full border border-white/10 bg-zinc-950 transition duration-300 ease-out group-hover:scale-[1.03]`}
        style={{
          boxShadow: `0 0 0 1px ${profile.accent}44, 0 18px 46px ${profile.glow}`
        }}
        aria-label={`${mode} avatar`}
      >
        <div
          className="absolute inset-0 opacity-80 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 35% 20%, ${profile.accent}44, transparent 34%), linear-gradient(145deg, #181b23, #07080b 72%)`
          }}
        />
        <svg className="absolute inset-0 h-full w-full opacity-35 transition duration-300" viewBox="0 0 100 100" aria-hidden="true">
          <Motif profile={profile} size={size} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${initialsClass} font-semibold tracking-wide text-zinc-50 drop-shadow`}>{profile.initials}</span>
        </div>
        {typeof matchPercent === "number" ? (
          <div className="absolute inset-x-3 bottom-2 h-1 overflow-hidden rounded-full bg-zinc-800/90">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${matchPercent}%`, backgroundColor: profile.accent }}
            />
          </div>
        ) : null}
      </div>
      {size === "lg" ? <p className="max-w-28 text-center text-[11px] text-zinc-500">{profile.label}</p> : null}
    </div>
  );
}
