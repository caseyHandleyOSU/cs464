import { withDataValidation } from "./validation"
import { getSupabaseClient } from "@/lib/supabase"


export const PUT = withDataValidation(async (body) => {
  const supabase = getSupabaseClient()

  // Validate the order values are unique within the items array
  const orderSet = new Set<number>(body.items.map(item => item.order))
  if(orderSet.size !== body.items.length) {
    return Response.json({ error: "Item order values must be unique" }, { status: 400 })
  }

  // Create the dataset entry
  const { data, error } = await supabase
    .from('datasets')
    .upsert([{
      dataset_slug: body.slug,
      title: body.title,
      description: body.description,
      updated_at: new Date().toISOString(),
    }], { onConflict: "dataset_slug" })
    .select('id')

  if (error) {
    if(error.code === '23505') { // unique violation
      return Response.json({ error: 'A dataset with this slug already exists' }, { status: 409 })
    }
    return Response.json({ error: 'Failed to create dataset' }, { status: 500 })
  }

  const datasetId = data?.[0]?.id

  if (!datasetId) {
    console.error('No dataset ID returned after insertion')
    return Response.json({ error: 'Failed to create dataset' }, { status: 500 })
  }

  // Create the dataset items
  const itemsToInsert = body.items.map(item => ({
    dataset_id: datasetId,
    item_name: item.name,
    item_order: item.order,
  }))

  // Remove old items
  await supabase
    .from('dataset_items')
    .delete()
    .eq('dataset_id', datasetId)
  
  const { error: itemsError } = await supabase
    .from('dataset_items')
    .upsert(itemsToInsert)

  if (itemsError) {
    console.error('Error inserting dataset items:', itemsError)
    // Rollback the dataset creation since item creation failed
    await supabase.from('datasets').delete().eq('id', datasetId)
    return Response.json({ error: 'Failed to create dataset items' }, { status: 500 })
  }

  return Response.json({ message: 'Dataset updated successfully', datasetId }, { status: 200 })
})