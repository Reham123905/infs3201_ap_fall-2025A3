const { MongoClient } = require('mongodb')
require('dotenv').config()

const MONGO_URL = process.env.MONGO_URL
let client = null

/**
 * Connect to MongoDB.
 * @async
 * @returns {Promise<MongoClient>} MongoDB client instance.
 */
async function connect() {
  if (client) return client
  client = new MongoClient(MONGO_URL)
  await client.connect()
  return client
}

/**
 * Get the photos collection.
 * @async
 * @returns {Promise<import('mongodb').Collection>} The photos collection handle.
 */
async function photosCollection() {
  const c = await connect()
  return c.db('infs3201_fall2025').collection('photos')
}

/**
 * Get the albums collection.
 * @async
 * @returns {Promise<import('mongodb').Collection>} The albums collection handle.
 */
async function albumsCollection() {
  const c = await connect()
  return c.db('infs3201_fall2025').collection('albums')
}

/**
 * Find one photo by its numeric ID.
 * @async
 * @param {number} id - Photo ID.
 * @returns {Promise<Object|null>} Photo document, or null if not found.
 */
async function findPhotoById(id) {
  const col = await photosCollection()
  return col.findOne({ id: id })
}

/**
 * Update a photo’s title and/or description by ID.
 * @async
 * @param {number} id - Photo ID.
 * @param {Object} updates - Object containing fields to update.
 * @returns {Promise<boolean>} True if update succeeded.
 */
async function updatePhotoById(id, updates) {
  const col = await photosCollection()
  const res = await col.updateOne({ id: id }, { $set: updates })
  return res.matchedCount === 1
}

/**
 * Add a tag to a photo, avoiding duplicates (case-insensitive).
 * @async
 * @param {number} id - Photo ID.
 * @param {string} tag - Tag to add.
 * @returns {Promise<boolean>} True if tag added.
 */
async function addTagToPhoto(id, tag) {
  const col = await photosCollection()
  const photo = await col.findOne({ id: id })
  if (!photo) return false
  const tags = Array.isArray(photo.tags) ? photo.tags : []
  const lower = tag.toLowerCase()
  if (tags.some(t => String(t).toLowerCase() === lower)) return false
  tags.push(tag)
  const res = await col.updateOne({ id: id }, { $set: { tags } })
  return res.matchedCount === 1
}

/**
 * Get all albums.
 * @async
 * @returns {Promise<Array>} List of album documents.
 */
async function getAllAlbums() {
  const col = await albumsCollection()
  return col.find({}).toArray()
}

/**
 * Get all photos for a specific album.
 * @async
 * @param {number} albumId - Album ID.
 * @returns {Promise<Array>} Array of photo documents.
 */
async function getPhotosByAlbum(albumId) {
  const col = await photosCollection()
  return col.find({ albums: albumId }).toArray()
}

module.exports = {
  connect,
  findPhotoById,
  updatePhotoById,
  addTagToPhoto,
  getAllAlbums,
  getPhotosByAlbum
}
