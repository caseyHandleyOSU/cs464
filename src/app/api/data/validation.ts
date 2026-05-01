import * as z from "zod"
import { NextRequest } from "next/server"

const MIN_ITEMS = 2
// The expected structure of the request body & validation rules
const DataInput = z.object({
    slug: z.string("Missing slug")
      .min(3, "Slug must be at least 3 characters long")
      .regex(/^[a-z0-9\-]*$/, "Slug must be lowercase and can only contain letters, numbers, and hyphens")
      .regex(/^.*[a-z0-9]$/, "Slug must not end with a hyphen"),
    title: z.string("Missing title").min(1, "Title cannot be empty"),
    description: z.string().optional(),
    items: z.array(
      z.object({
          name: z.string("Missing item name").min(1, "Item name cannot be empty"),
          order: z.number().min(0, "Item order must be a positive integer")
      })
    ).min(MIN_ITEMS, `At least ${MIN_ITEMS} item(s) are required`)
})

export function withDataValidation(fn: (data: z.infer<typeof DataInput>, request: NextRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json()
      const data = DataInput.parse(body)
      return await fn(data, request)
    } catch (err) {
      handleZodError(err)
    }
  }
}

export function handleZodError(err: unknown) {
  if (err instanceof z.ZodError) {
    return Response.json({ error: z.treeifyError(err) }, { status: 400 })
  } else if(err instanceof SyntaxError) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }
  return Response.json({ error: "Internal Server Error" }, { status: 500 })
}