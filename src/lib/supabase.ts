import { createServerClient } from "./supabase/createServerClient"
import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  return createServerClient()
}

export function getSupabaseClientNoAuth() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseKey)
  return supabaseClient
}