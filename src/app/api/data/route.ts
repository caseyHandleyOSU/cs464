import path from "path";
import fs from "fs/promises"
import { DataEntry } from "@/types/data";

const DATA_DIRECTORY = path.join(process.cwd(), "data");

export async function GET(request: Request) {
  const items = await fs.readdir(DATA_DIRECTORY, { withFileTypes: true })
  const promises = await Promise.all(items.map(item => {
    // Skip directories
    if (!item.isFile()) return
    // Skip non-JSON files
    if (path.extname(item.name) !== ".json") return
    
    const filePath = path.join(DATA_DIRECTORY, item.name)
    return fs.readFile(filePath, "utf-8")
  }))
  const data: DataEntry[] = promises
    .filter(f => typeof f === 'string')
    .map((fileData) => JSON.parse(fileData)) as DataEntry[]

  return Response.json(data)
}