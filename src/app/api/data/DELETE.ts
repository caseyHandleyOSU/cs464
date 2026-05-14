import { createServerClient } from "@/lib/supabase/createServerClient"
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const supabase = await createServerClient()
  const user = (await supabase.auth.getUser()).data?.user

  if(!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (slug) {
    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('dataset_slug', slug)
      // .eq('owner_id', user.id)

    if (error) {
      return Response.json({ error: "Failed to delete dataset" }, { status: 500 });
    }

    return Response.json({ message: "Dataset deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "No slug provided" }, { status: 400 });
}
