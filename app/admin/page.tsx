import type { Metadata } from "next";
import Link from "next/link";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAllCompanies } from "@/lib/universe";

export const metadata: Metadata = {
  title: "Universe Admin | Mining Intelligence",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const enabled = process.env.ADMIN_ENABLED === "true";

  // V1 environment gating only prevents accidental exposure. Replace this with
  // authenticated sessions, role checks, CSRF protection and audit logging
  // before allowing admin writes in a deployed environment.
  if (!enabled) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-950 px-4 text-zinc-100">
        <section className="w-full max-w-md rounded-lg border border-zincLine bg-zincPanel p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caution">Restricted route</p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-50">Admin disabled</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Set <code className="font-mono text-zinc-300">ADMIN_ENABLED=true</code> in the server environment to enable Admin V1.
          </p>
          <Link href="/" className="mt-6 inline-block rounded border border-zincLine px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300 hover:border-zinc-500">
            Return to screener
          </Link>
        </section>
      </main>
    );
  }

  return <AdminDashboard initialCompanies={getAllCompanies()} />;
}
