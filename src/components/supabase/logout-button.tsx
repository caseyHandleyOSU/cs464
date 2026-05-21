"use client"

import { createBrowserClient } from "@/lib/supabase/createBrowserClient"
import { useRouter } from "next/navigation"
import { Button } from "@mui/material"

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
  };

  return (
    <Button variant="outlined" onClick={logout}>
      Logout
    </Button>
  );
}
