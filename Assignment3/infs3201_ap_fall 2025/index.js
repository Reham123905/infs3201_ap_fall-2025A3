const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
require('dotenv').config()
const business = require('./business')

const app = express()
const PORT = process.env.PORT || 8000

/**
 * Main Express application module.
 * Sets up Handlebars, static files, and routes for albums and photos.
 * @module index
 */
// Handlebars setup with helpers
const hbs = exphbs.create({
  defaultLayout: false,
  helpers: {
    eq: (a, b) => Number(a) === Number(b)
  }
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static(path.join(__dirname, 'public')))

/** Show all albums */
app.get('/', async (req, res) => {
  const albums = await business.listAlbums()
  res.render('albums', { albums, layout: false })
})

/** Show photos in one album */
app.get('/albums/:id', async (req, res) => {
  const albumId = parseInt(req.params.id)
  const photos = await business.listPhotosByAlbum(albumId)
  const count = photos.length
  res.render('album', { albumId, photos, count, layout: false })
})

/** Show one photo */
app.get('/photos/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const photo = await business.getPhotoById(id)
  if (!photo) return res.status(404).send('Photo not found')
  res.render('photo', { photo, layout: false })
})

/** Edit form page */
app.get('/photos/:id/edit', async (req, res) => {
  const id = parseInt(req.params.id)
  const photo = await business.getPhotoById(id)
  if (!photo) return res.status(404).send('Photo not found')
  res.render('edit', { photo, layout: false })
})

/** Handle edit form submit (PRG + validation) */
app.post('/photos/:id/edit', async (req, res) => {
  const id = parseInt(req.params.id)
  const title = req.body.title
  const description = req.body.description

  if (!title || !description) {
    return res.render('edit', {
      photo: { id, title, description },
      error: 'Title and description are required',
      layout: false
    })
  }

  const ok = await business.updatePhoto(id, title, description)
  if (!ok) {
    return res.render('edit', {
      photo: { id, title, description },
      error: 'Could not update',
      layout: false
    })
  }

  res.redirect(`/photos/${id}`)
})

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
)
