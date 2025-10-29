// db.js
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

const file = path.join(dataDir, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Initialize DB if empty
async function init() {
  await db.read()
  db.data = db.data || { todos: [] }
  await db.write()
}

init()

module.exports = db

