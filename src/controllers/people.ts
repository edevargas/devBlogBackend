const peopleRouter = require('express').Router()
import { Request, Response, NextFunction } from 'express'
import Person, { IPerson } from '../models/Person'

peopleRouter.get('/', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const peoples = await Person.find({})
    response.json(peoples)
  } catch (error) {
    next(error)
  }

})
peopleRouter.post('/', async (request: Request, response: Response) => {
  const person: IPerson = request.body
  if (!person || !person.name) {
    return response.status(400).json({
      error: 'Is not a valid person'
    })
  }
  const newPerson = new Person({
    ...person
  })

  const savedPerson = await newPerson.save()
  response.json(savedPerson)
})

peopleRouter.get('/:id', (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params
  Person.findById(id)
    .then((result: IPerson) => {
      result ? response.json(result) : response.status(404).end()
    })
    .catch(next)
})

peopleRouter.delete('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params
  try {
    await Person.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

peopleRouter.put('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params
  const people = request.body
  if (Object.keys(people).length === 0 || !people) {
    response.status(400).send({
      error: 'Person can not be an empty object'
    })
  }
  const personEdited = {
    ...people,
    modificationDate: new Date().toISOString()
  }
  try {
    const result = await Person.findByIdAndUpdate(id, personEdited, { new: true })
    result
      ? response.json(result)
      : next({
        name: 'NotFound',
        error: `Person with id ${id} does not exists`
      })
  } catch (error) {
    next(error)
  }
})

module.exports = peopleRouter