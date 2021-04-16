require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.log('-----')

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello Jim!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((person) => {
    response.json(person)
  })
})
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((note) => {
    response.json(note)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then((person) => {
    response.send(`<p>Phonebook has info for ${person.length} people</p>  
  
  <p>${new Date()}</p>`)
  })
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or Number missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => {
      console.log('-----')
      next(error)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler)
