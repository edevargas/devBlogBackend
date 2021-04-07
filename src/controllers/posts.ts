const postsRouter = require('express').Router()
import { Request, Response, NextFunction } from 'express'
import Post, { IPost } from '../models/Post'

postsRouter.get('/', async (request: Request, response: Response) => {
  const posts = await Post.find({})
  response.json(posts)
})

postsRouter.get('/:id', (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params
  Post.findById(id)
    .then((result: IPost) => {
      result ? response.json(result) : response.status(404).end()
    })
    .catch(next)
})

postsRouter.post('/', async (request: Request, response: Response, next: NextFunction) => {
  const post = request.body
  if (!post || !post.title) {
    return response.status(400).json({
      error: 'Is not a valid post'
    })
  }
  const newPost = new Post({
    ...post,
    creationDate: new Date().toISOString()
  })
  try {
    const savedPost = await newPost.save()
    response.json(savedPost)
  } catch (error) {
    next(error)
  }
})

postsRouter.delete('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params
  try {
    await Post.findByIdAndDelete(id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

postsRouter.put('/:id', async (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params
  const post = request.body
  if (Object.keys(post).length === 0 || !post) {
    response.status(400).send({
      error: 'Post can not be an empty object'
    })
  }

  const postEdited = {
    ...post,
    modificationDate: new Date().toISOString()
  }
  try {
    const result = await Post.findByIdAndUpdate(id, postEdited, { new: true })
    result
      ? response.json(result)
      : next({
        name: 'NotFound',
        error: `Post with id ${id} does not exists`
      })
  } catch (error) {
    next(error)
  }
})

module.exports = postsRouter