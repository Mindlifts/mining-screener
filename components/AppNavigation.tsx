"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Screener" },
  { href: "/asset-map", label: "Asset Map" },
  { href: "/investment-cases", label: "Investment Cases" },
  { href: "/admin", label: "Admin" }
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="flex w-full max-w-full items-center gap-1 overflow-x-auto border-b border-zincLine">
      {navigation.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 border-b-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              active
                ? "border-terminalGreen text-zinc-50"
                : "border-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
