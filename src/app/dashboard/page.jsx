// este es un Server Component (sin 'use client')
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth-options";
import DashboardClient from "../../components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/connexion");
  }

  return <DashboardClient session={session} />;
}
