import type { AbsurdMetricId } from "@/types/absurdMetrics";

type IconProps = { className?: string };

function SvgFrame({ children, className = "" }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 160 100"
      fill="none"
      className={`h-full w-full overflow-visible ${className}`}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function BarrickTruckIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      <path d="M15 69h101l17-31h18v31" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      <path d="M35 38h64l17 31H21l14-31Z" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="3" />
      <circle cx="43" cy="76" r="13" fill="#090b10" stroke="currentColor" strokeWidth="5" />
      <circle cx="126" cy="76" r="13" fill="#090b10" stroke="currentColor" strokeWidth="5" />
      <path d="M3 83h17M145 83h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path className="transition-transform duration-300 group-hover:-translate-x-2" d="M8 60h12v8H8z" fill="currentColor" />
    </SvgFrame>
  );
}

export function SleepingCEOIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      <path d="M24 72c14-28 42-36 69-18 15 10 28 13 45 9v18H24V72Z" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="3" />
      <circle cx="67" cy="48" r="18" stroke="currentColor" strokeWidth="4" />
      <path d="M58 49c4 3 8 3 12 0M83 45h18M88 39h13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path className="transition-transform duration-300 group-hover:-translate-y-1" d="M110 25h16l-16 15h16" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M35 76h30M99 70h28" stroke="#9de58b" strokeWidth="5" strokeLinecap="round" />
    </SvgFrame>
  );
}

export function RoadToStarbucksIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      <path d="M15 88c19-8 26-24 45-26 23-3 28 22 50 12 15-7 17-25 34-36" stroke="currentColor" strokeWidth="12" opacity=".2" />
      <path d="M15 88c19-8 26-24 45-26 23-3 28 22 50 12 15-7 17-25 34-36" stroke="currentColor" strokeWidth="3" strokeDasharray="7 7" />
      <path d="M20 25v36M13 33h14M13 45h14" stroke="currentColor" strokeWidth="3" />
      <path d="M120 21h25l-3 27h-19l-3-27Z" stroke="currentColor" strokeWidth="3" />
      <path d="M145 27h7c6 0 6 12 0 12h-9" stroke="currentColor" strokeWidth="3" />
      <path className="transition-transform duration-300 group-hover:-translate-y-1" d="M126 15c-5-7 5-8 0-14M137 15c-5-7 5-8 0-14" stroke="currentColor" strokeWidth="2" />
    </SvgFrame>
  );
}

export function InstitutionalShieldIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      <path d="M80 8 130 25v27c0 25-18 36-50 43-32-7-50-18-50-43V25L80 8Z" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="4" />
      <path d="m54 52 17 17 35-37" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path className="transition-opacity duration-300 group-hover:opacity-100" d="M80 17v68" stroke="currentColor" strokeWidth="2" opacity=".3" />
    </SvgFrame>
  );
}

export function ShovelTeamIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      {[38, 80, 122].map((x) => (
        <g key={x}>
          <circle cx={x} cy="31" r="12" stroke="currentColor" strokeWidth="3" />
          <path d={`M${x - 18} 78c2-22 8-32 18-32s16 10 18 32`} fill="currentColor" opacity=".17" stroke="currentColor" strokeWidth="3" />
        </g>
      ))}
      <path d="M18 89 53 51M102 89l35-38M50 88l-9-12 17-3M134 88l-9-12 17-3" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </SvgFrame>
  );
}

export function PressReleaseSirenIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      <path d="M43 88h75M54 76h53l-5-38c-2-15-42-15-44 0l-4 38Z" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="4" />
      <path d="M80 25V8M42 34 28 23M118 34l14-11M37 57H17M123 57h20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path className="transition-transform duration-300 group-hover:scale-110" d="M64 56h32" stroke="#ef6b72" strokeWidth="8" strokeLinecap="round" />
    </SvgFrame>
  );
}

export function ResourceFunnelIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      <path d="M17 14h126L98 58v25L65 94V58L17 14Z" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="43" cy="31" r="6" fill="currentColor" />
      <circle cx="71" cy="31" r="8" fill="currentColor" />
      <circle cx="103" cy="31" r="5" fill="currentColor" />
      <circle className="transition-transform duration-300 group-hover:translate-y-2" cx="81" cy="73" r="7" fill="#f4c167" />
    </SvgFrame>
  );
}

export function DominoRiskIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      {[18, 48, 78, 108, 138].map((x, index) => (
        <rect
          key={x}
          x={x}
          y={24 + index * 6}
          width="15"
          height="55"
          rx="2"
          transform={`rotate(${index * 4} ${x + 7} ${52 + index * 6})`}
          fill="currentColor"
          opacity={0.14 + index * 0.08}
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
      <path className="transition-transform duration-300 group-hover:translate-x-2" d="m18 17 18 8-17 9" stroke="currentColor" strokeWidth="3" />
    </SvgFrame>
  );
}

export function ValuationRocketIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      <path d="M15 84 43 69l24 8 25-36 19 10 34-35" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:translate-x-2" d="m108 37 27-25 12 4-4 12-27 25-18 4 10-20Z" fill="currentColor" opacity=".22" stroke="currentColor" strokeWidth="3" />
      <path d="m101 55-12 11 17-2M119 35l8 8" stroke="currentColor" strokeWidth="3" />
    </SvgFrame>
  );
}

export function SleepingGiantIcon(props: IconProps) {
  return (
    <SvgFrame {...props}>
      <path d="M5 84 32 49l22 14 22-42 24 31 16-12 39 44H5Z" fill="currentColor" opacity=".15" stroke="currentColor" strokeWidth="3" />
      <path d="M39 75c14-21 32-27 51-15 15 10 28 10 42 2" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M70 61c8-6 16-6 24 0" stroke="currentColor" strokeWidth="3" />
      <path className="transition-transform duration-300 group-hover:scale-x-125" d="M76 61h13" stroke="#f4c167" strokeWidth="5" strokeLinecap="round" />
      <path d="M30 87h105" stroke="currentColor" strokeWidth="3" />
    </SvgFrame>
  );
}

const icons: Record<AbsurdMetricId, (props: IconProps) => React.ReactNode> = {
  "barrick-bother": BarrickTruckIcon,
  "ceo-sleep": SleepingCEOIcon,
  "road-to-starbucks": RoadToStarbucksIcon,
  "institutional-comfort": InstitutionalShieldIcon,
  "shovel-density": ShovelTeamIcon,
  "hype-liability": PressReleaseSirenIcon,
  "geology-reality": ResourceFunnelIcon,
  "things-must-go-right": DominoRiskIcon,
  "double-without-news": ValuationRocketIcon,
  "sleeping-giant": SleepingGiantIcon
};

export function AbsurdMetricIllustration({
  id,
  className
}: {
  id: AbsurdMetricId;
  className?: string;
}) {
  const Icon = icons[id];
  return <Icon className={className} />;
}
