import express from 'express'
import cors from 'cors'

import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

const corsOptions = {
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static('public'))

// LIST
app.get('/api/toy', (req, res) => {
    const { name, maxPrice, label } = req.query.filterBy ?? {};

    const filterBy = { name, price: +maxPrice, label }
    toyService
        .query(filterBy)
        .then(toys => {
            res.send(toys)
        })
        .catch(err => {
            loggerService.error('Cannot load toys', err)
            res.status(400).send('Cannot load toys')
        })
})

// ADD 
app.post('/api/toy', (req, res) => {
    const { name, price } = req.body

    const toy = {
        name,
        price: +price,
    }
    toyService
        .save(toy)
        .then(savedToy => {
            res.send(savedToy)
        })
        .catch(err => {
            loggerService.error('Cannot add toy', err)
            res.status(400).send('Cannot add toy')
        })
})

//EDIT 
app.put('/api/toy', (req, res) => {
    const { name, price, _id } = req.body
    const toy = {
        _id,
        name,
        price: +price,
    }
    toyService
        .save(toy)
        .then(savedToy => {
            res.send(savedToy)
        })
        .catch(err => {
            loggerService.error('Cannot update toy', err)
            res.status(400).send('Cannot update toy')
        })
})

//GETBYID 
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService
        .get(toyId)
        .then(toy => {
            toy.msgs = ['Hey']
            res.send(toy)
        })
        .catch(err => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send(err)
        })
})

// REMOVE

app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    console.log(toyId)
    toyService
        .remove(toyId)
        .then(_ => {
            res.send(toyId)
        })
        .catch(err => {
            loggerService.error('Cannot delete toy', err)
            res.status(400).send('Cannot delete toy, ' + err)
        })
})


const port = process.env.PORT || 3030

app.listen(port, () => {
  loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})