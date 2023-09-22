import fs from 'fs'
import { utilService } from './util.service.js'

const toys = utilService.readJsonFile('data/toys.json')

export const toyService = {
    query,
    get,
    remove,
    save,
}

function query(filterBy = {}) {
    let toysToReturn = toys
    if (filterBy.name) toysToReturn = toysToReturn.filter(toy => toy.name.includes(filterBy.name))
    if (filterBy.maxPrice) toysToReturn = toysToReturn.filter(toy => toy.price < filterBy.maxPrice)
    if (filterBy.label) toysToReturn = toysToReturn.filter(toy => toy.labels.includes(filterBy.label))

    return Promise.resolve(toysToReturn)
}

function get(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('Toy not found!')
    return Promise.resolve(toy)
}


function remove(toyId, loggedinUser) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy, loggedinUser) {
    if (toy._id) {
      const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
      toyToUpdate.name = toy.name
      toyToUpdate.price = toy.price
    } else {
      toy._id = _makeId()
      toys.push(toy)
    }
    return _saveToysToFile().then(() => toy)
}


function _makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }
  
  function _saveToysToFile() {
    return new Promise((resolve, reject) => {
      const toysStr = JSON.stringify(toys, null, 4)
      fs.writeFile('data/toys.json', toysStr, err => {
        if (err) {
          return console.log(err)
        }
        console.log('The file was saved!')
        resolve()
      })
    })
  }