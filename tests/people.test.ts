const { server } = require('@app')
const mongoose = require('mongoose')
import Person from '@models/Person'
import { IPerson } from '@models/Person'
import {
  api
} from './helpers/postsHelper'

beforeEach(async () => {
  await Person.deleteMany({}).exec()
  const newPerson = new Person({
    "name": "Eduardo",
    "lastname": "Lara",
    "email": "eduardo@gmail.com",
    "birthDate": 1231231231
  })
  await newPerson.save()
})

describe('Persons', () => {
  describe('-> Create One', () => {
    test('are returned as a json', async () => {
      await api.get('/api/people')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('should create one people', async () => {
      const peopleDB = await Person.find({})
      const peopleBefore = peopleDB.map((u: IPerson) => u.toJSON())
      const newPerson = {
        "name": "Eren",
        "lastname": "Jeager",
        "email": "erenardo@gmail.com",
        "birthDate": 1231231231
      }
      await api
        .post('/api/people')
        .send(newPerson)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const peopleDBAfter = await Person.find({})
      const peopleAfter = peopleDBAfter.map((u: IPerson) => u.toJSON())
      expect(peopleAfter).toHaveLength(peopleBefore.length + 1)

      const fullnames = peopleAfter.map((u: IPerson) => `${u.name} ${u.lastname}`)
      expect(fullnames).toContain(`${newPerson.name} ${newPerson.lastname}`)

    })

  })

})


afterAll(() => {
  mongoose.connection.close()
  server.close()
})