import { getSupabaseClient } from '@/lib/supabase'
import { NextRequest } from "next/server"

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id")
  const slug = searchParams.get("slug")

  if (!id && !slug) {
    return new Response("Missing id or slug", { status: 400 })
  }

  const supabase = getSupabaseClient()
  const query = supabase
    .from("datasets")
    .delete()

  if (id) {
    query.eq("id", id)
  } else if (slug) {
    query.eq("dataset_slug", slug)
  }

  const result = await query.single()

  if (result.error) {
    if(result.error.code === "PGRST116") { // no rows deleted, likely because dataset with given id/slug doesn't exist
      return new Response("Dataset not found", { status: 404 })
    }
    return new Response(result.error.message, { status: 500 })
  }

  return new Response("Dataset deleted successfully", { status: 200 })
}