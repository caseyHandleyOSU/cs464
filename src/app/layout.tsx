import { createServerClient } from "@/lib/supabase/createServerClient"
import type { Metadata } from "next"
import { LogoutButton } from "@/components/supabase/logout-button"

export const metadata: Metadata = {
  title: "CS464 Project",
  description: "Yet-to-be-named project for cs464",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = await createServerClient()
  const { data } = await client.auth.getUser()
  const { user } = data
  return (
    <html lang="en">
      <body>
        { user ? <LogoutButton /> : <></> }
        {children}
      </body>
    </html>
  );
}
