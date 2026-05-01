"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("./app"), { ssr: false });

/**
 * Client-side wrapper for the react-admin application.
 * Client Component
 *
 * @returns The dynamically imported admin App component with SSR disabled to prevent hydration errors from react-admin.
 *
 * @example
 * ```tsx
 * <AdminClient />
 * ```
 */
const AdminClient = () => {
  return <App />;
};

export default AdminClient;
