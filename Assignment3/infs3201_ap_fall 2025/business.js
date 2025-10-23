const persistence = require('./persistence')

/**
 * Get a photo by its ID.
 * @async
 * @param {number} id - The numeric ID of the photo.
 * @returns {Promise<Object|null>} The photo object, or null if not found.
 */
async function getPhotoById(id) {
  return persistence.findPhotoById(id)
}

/**
 * Update a photo’s title or description.
 * @async
 * @param {number} id - Photo ID.
 * @param {string} [title] - New title (optional).
 * @param {string} [description] - New description (optional).
 * @returns {Promise<boolean>} True if the photo was updated.
 */
async function updatePhoto(id, title, description) {
  const updates = {}
  if (title) updates.title = title
  if (description) updates.description = description
  if (Object.keys(updates).length === 0) return false
  return persistence.updatePhotoById(id, updates)
}

/**
 * Add a tag to a photo.
 * @async
 * @param {number} id - Photo ID.
 * @param {string} tag - Tag to add.
 * @returns {Promise<boolean>} True if the tag was successfully added.
 */
async function addTag(id, tag) {
  if (!tag || tag.trim() === '') return false
  return persistence.addTagToPhoto(id, tag.trim())
}

/**
 * List all albums.
 * @async
 * @returns {Promise<Array>} Array of album objects.
 */
async function listAlbums() {
  return persistence.getAllAlbums()
}

/**
 * List photos belonging to a specific album.
 * @async
 * @param {number} albumId - Album ID.
 * @returns {Promise<Array>} Array of photo objects.
 */
async function listPhotosByAlbum(albumId) {
  return persistence.getPhotosByAlbum(albumId)
}

module.exports = {
  getPhotoById,
  updatePhoto,
  addTag,
  listAlbums,
  listPhotosByAlbum
}
