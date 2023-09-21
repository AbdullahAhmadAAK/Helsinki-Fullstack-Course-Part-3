const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// const url =
//   `mongodb+srv://aak606:${password}@cluster0.rwhalao.mongodb.net/?retryWrites=true&w=majority`

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)



// if (process.argv.length == 3) {
//     Person.find({}).then(result => {
//         console.log(`Phonebook:`)
//         result.forEach(person => {
//             console.log(`${person.name} ${person.number}`)
//         })
//         mongoose.connection.close()
//       })
// }

// else if (process.argv.length == 5) {
//     const name = process.argv[3]
//     const number = process.argv[4]

//     const person = new Person({
//         name: name,
//         number: number,
//     })
      
//     person.save().then(result => {
//         console.log(`added ${result.name} number ${result.number} to phonebook`)
//         mongoose.connection.close()
//     })
// }