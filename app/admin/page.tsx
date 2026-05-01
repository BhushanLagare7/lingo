import { redirect } from "next/navigation";

import { isAdmin } from "@/lib/admin";

import AdminClient from "./admin-client";

/**
 * Server-side entry point for the admin application.
 * Server Component
 *
 * @returns Renders the AdminClient if the user is an admin, otherwise redirects to the home page.
 *
 * @example
 * ```tsx
 * <AdminPage />
 * ```
 */
const AdminPage = async () => {
  if (!(await isAdmin())) {
    redirect("/");
  }

  return <AdminClient />;
};

export default AdminPage;
