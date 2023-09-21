require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/Person')


app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
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

app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(notes => {
        if(notes) {
            response.json(notes)
        }
        else {
            // response.status(400).json({
            //     error: "notes not found"
            // })
            let error = {
                name: "PersonsNotFound",
                message: "Could not find persons at all"
            }
            next(error)
        }
    })
    .catch(error => {
        // response.json({
        //     error: error
        // })
        next(error)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id)
    .then(notes => {
        
        if(notes) {
            console.log(notes)
            response.json(notes)
        }
        else {
            // response.status(400).json({
            //     error: "that note not found"
            // })
            let error = {
                name: "MissingPerson",
                message: `Could not find person with ID of ${id}`
            }

            next(error)
        }
    })
    .catch(error => {
        // response.json({
        //     error: error
        // })
        next(error)
    })

})

app.get('/info', (request, response) => {
    // Use the countDocuments method to count the documents in the 'Person' collection
    Person.countDocuments({})
      .then((count) => {
        console.log('Number of documents in the collection:', count);
  
        // Send the count information as a response
        response.status(200).json({ message: `Phonebook has info for ${count} people.`, date: new Date() });
      })
      .catch((err) => {
        console.error('Error counting documents:', err);
        // response.status(500).json({ error: 'Internal Server Error' }); // Handle the error and send an appropriate response
        next(err)
      });
  });
  
  

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    // phonenumbers_list = phonenumbers_list.filter(list_number => list_number.id !== id)
    // response.status(204).end()

    Person.findByIdAndRemove(id)
    .then(result => {
        if(result){
            response.status(204).send({
                message: `successfully deleted person with id ${id}`
            })
        }
        else {
            let error = {
                name: "MissingPerson",
                message: "Could not find person with that ID to delete"
            }
            next(error)
        }
      
      console.log('then stmt worked', result)
    })
    .catch(error => {
        console.log('catch stmt worked')
        next(error)
    })
})

app.post('/api/persons', (request, response, next) => {
    
    const personInput = request.body
    
    let error_missing_inputs = false
    let error_nonunique_name = false

    if(personInput.name === undefined || personInput.name === "" || personInput.number === undefined || personInput.number === "") {
        error_missing_inputs = true
    }
    
    // let namefound = phonenumbers_list.find(list_number => personInput.name === list_number.name)
    // if(namefound) {
    //     error_nonunique_name = true
    // }

    if(!error_missing_inputs && !error_nonunique_name) {
        // const randomly_generated_id = Math.floor(Math.random() * 10000 + 1)
        // let person = {
        //     id: randomly_generated_id,
        //     name: personInput.name,
        //     number: personInput.number
        // }
        // phonenumbers_list = phonenumbers_list.concat(person)
        // response.json(person)

        

            const person = new Person({
                name: personInput.name,
                number: personInput.number,
            })

            person.save().then(savedPerson => {
                response.json(savedPerson)
            })

    }

    else {
        let error = ""
        if(error_missing_inputs) { // this iwll work
            error = {
                name: "InvalidInput",
                message: "both name and number have to be provided"
            }
        }
        else if(error_nonunique_name) { // THIS WONT WORK cz not asked to implement this
            error = {
                name: "InvalidInput",
                message: "name must be unique"
            }
        }
        // response.status(400).json({
        //     error: error
        // })
        next(error)
    }
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if(error.name === 'MissingPerson') {
        return response.status(400).send({ error: 'person not found' })
    }
    else if(error.name === 'InvalidInput') {
        return response.status(400).send({ error: 'invalid input please retype' })
    }
  
    next(error)
  }
  
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is up and running on port # ${PORT}`)
})