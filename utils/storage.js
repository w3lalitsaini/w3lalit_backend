import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "..", "data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

export function readCollection(collection) {
  try {
    const file = getFilePath(collection);
    if (!fs.existsSync(file)) {
      return [];
    }
    const data = fs.readFileSync(file, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error(`Error reading ${collection}:`, err.message);
    return [];
  }
}

export function writeCollection(collection, data) {
  try {
    const file = getFilePath(collection);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error(`Error writing ${collection}:`, err.message);
    return false;
  }
}

export function insertItem(collection, item) {
  const items = readCollection(collection);
  const newItem = {
    _id: "local_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
    ...item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  writeCollection(collection, items);
  return newItem;
}

export function updateItem(collection, id, updates) {
  const items = readCollection(collection);
  const index = items.findIndex((i) => i._id === id || i.id === id);
  if (index === -1) return null;
  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeCollection(collection, items);
  return items[index];
}

export function deleteItem(collection, id) {
  const items = readCollection(collection);
  const filtered = items.filter((i) => i._id !== id && i.id !== id);
  writeCollection(collection, filtered);
  return filtered.length < items.length;
}
