const promptSync = require('prompt-sync')
const prompt = promptSync({ sigint: true })
const business = require('./business')

/**
 * Command-line interface for the Digital Media Catalog.
 * Presents a simple menu to list albums, find a photo by ID,
 * update a photo's title description, and add tags.
 *
 * This module is the presentation CLI layer and delegates logic to the business layer.
 * It does not export anything; running this file will start the interactive loop.
 *
 * @module presentation
 */

/**
 * Main CLI loop.
 * @async
 * @returns {Promise<void>} Resolves when the user exits the CLI.
 */

async function main() {
  console.log('Digital Media Catalog CLI')

  while (true) {
    console.log('\n1. List albums\n2. Find Photo by ID\n3. Update Photo\n4. Add Tag\n5. Exit')
    const choice = prompt('Select: ')

    if (choice === '1') {
      const albums = await business.listAlbums()
      for (const a of albums) console.log(`- ${a.id}: ${a.name}`)
    } else if (choice === '2') {
      const id = parseInt(prompt('Photo ID: '))
      const photo = await business.getPhotoById(id)
      console.log(photo ? photo : 'Not found')
    } else if (choice === '3') {
      const id = parseInt(prompt('Photo ID: '))
      const title = prompt('New title (blank = keep): ')
      const desc = prompt('New description (blank = keep): ')
      const ok = await business.updatePhoto(id, title || undefined, desc || undefined)
      console.log(ok ? 'Updated' : 'Not updated')
    } else if (choice === '4') {
      const id = parseInt(prompt('Photo ID: '))
      const tag = prompt('Tag: ')
      const ok = await business.addTag(id, tag)
      console.log(ok ? 'Tag added' : 'Duplicate or invalid')
    } else if (choice === '5') {
      console.log('Goodbye!')
      break
    } else {
      console.log('Invalid choice')
    }
  }
}

main().catch(err => console.error('CLI Error:', err))
