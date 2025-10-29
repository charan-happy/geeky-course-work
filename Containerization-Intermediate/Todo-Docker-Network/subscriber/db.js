import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')

// Define adapter
const adapter = new JSONFile(file)
const db = new Low(adapter, { todos: [] }) // ✅ provide default structure here

// Read data from file or initialize
await db.read()

// If db.json was empty, set default data
db.data ||= { todos: [] }

await db.write()

export default db

