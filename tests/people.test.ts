const { server } = require('@app')
const mongoose = require('mongoose')
import Person from '@models/Person'
import { IPerson } from '@models/Person'
import {
  api
} from './helpers/postsHelper'

beforeEach(async () => {
  jest.setTimeout(10000)
  await Person.deleteMany({}).exec()
  const newPerson = new Person({
    'name': 'Eduardo',
    'lastname': 'Lara',
    'email': 'eduardo@gmail.com',
    'birthDate': 13134234234
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
    test('should get All people', async () => {
      const peopleDB = await Person.find({})
      const peopleBefore = peopleDB.map((u: IPerson) => u.toJSON())
      const newPerson = new Person({
        'name': 'Pablo',
        'lastname': 'Jaramillo',
        'email': 'pablo@gmail.com',
        'birthDate': 123123123123
      })
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