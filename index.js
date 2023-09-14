const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(function (tokens, req, res) {
    // how to return body only if post request?
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens.body(req, res)
        ].join(' ')
  }))

let phonenumbers_list = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phonenumbers_list)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonenumbers_list.find(list_number => list_number.id === id)
    if(person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    let str_resp = `Phonebook has info for ${phonenumbers_list.length} people. <br/> ${new Date()}`
    response.send(str_resp)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonenumbers_list = phonenumbers_list.filter(list_number => list_number.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    
    const personInput = request.body
    
    let error_missing_inputs = false
    let error_nonunique_name = false

    if(personInput.name === undefined || personInput.name === "" || personInput.number === undefined || personInput.number === "") {
        error_missing_inputs = true
    }
    
    let namefound = phonenumbers_list.find(list_number => personInput.name === list_number.name)
    if(namefound) {
        error_nonunique_name = true
    }

    if(!error_missing_inputs && !error_nonunique_name) {
        const randomly_generated_id = Math.floor(Math.random() * 10000 + 1)
        let person = {
            id: randomly_generated_id,
            name: personInput.name,
            number: personInput.number
        }
        phonenumbers_list = phonenumbers_list.concat(person)
        response.json(person)
    }

    else {
        let error = ""
        if(error_missing_inputs) {
            error = "both name and number have to be provided"
        }
        else if(error_nonunique_name) {
            error = "name must be unique"
        }
        response.status(400).json({
            error: error
        })
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is up and running on port # ${PORT}`)
})