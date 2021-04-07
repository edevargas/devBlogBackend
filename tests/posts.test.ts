const { server } = require('@app')
const mongoose = require('mongoose')
import Post from '@models/Post'
import {
  api,
  initialPosts,
  getAllPostTitles,
  newPost,
  getFirstPost
} from './helpers/postsHelper'

beforeEach(async () => {
  await Post.deleteMany({}).exec()
  await Post.insertMany(initialPosts)
})
describe('Posts', () => {
  describe('-> Get all', () => {
    test('are returned as a json', async () => {
      await api.get('/api/posts')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('there are two posts', async () => {
      const response = await api.get('/api/posts')
      expect(response.body).toHaveLength(initialPosts.length)
    })
    test('the first note is name is Post 1', async () => {
      const { titles } = await getAllPostTitles()
      expect(titles).toContain('Post 1')
    })
  })

  describe('-> Create one', () => {
    test('a valid post can be added', async () => {
      await api
        .post('/api/posts')
        .send(newPost)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const { titles } = await getAllPostTitles()
      expect(titles).toContain(newPost.title)
      expect(titles).toHaveLength(initialPosts.length + 1)
    })

    test('a empty post can not be added', async () => {
      const emptyPost = {}
      await api
        .post('/api/posts')
        .send(emptyPost)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/posts')
      expect(response.body).toHaveLength(initialPosts.length)
    })
  })

  describe('-> Delete one', () => {
    test('a valid post can be deleted', async () => {
      const allPosts = await api.get('/api/posts')
      const postToDelete = allPosts.body[0]

      await api
        .delete(`/api/posts/${postToDelete.id}`)
        .expect(204)

      const { titles } = await getAllPostTitles()
      expect(titles).toHaveLength(initialPosts.length - 1)
      expect(titles).not.toContain(postToDelete.title)
    })
    test('a invalid post can not be deleted', async () => {
      await api
        .delete('/api/posts/12345')
        .expect(400)

      const { titles } = await getAllPostTitles()
      expect(titles).toHaveLength(initialPosts.length)
    })
  })

  describe('-> Update one', () => {
    test('a valid post can be updated', async () => {
      const postToUpdate = await getFirstPost()
      postToUpdate.title = 'I am the first dummy post'

      await api
        .put(`/api/posts/${postToUpdate.id}`)
        .send(postToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const { titles } = await getAllPostTitles()
      expect(titles).toHaveLength(initialPosts.length)
      expect(titles).toContain(postToUpdate.title)
    })
    test('an empty post can not be updated', async () => {
      const postToUpdate = await getFirstPost()
      await api
        .put(`/api/posts/${postToUpdate.id}`)
        .send({})
        .expect(400)

      const { titles } = await getAllPostTitles()
      expect(titles).toHaveLength(initialPosts.length)
    })
    test('an invalid id post can not be updated', async () => {
      const postToUpdate = await getFirstPost()
      const originalTitle = postToUpdate.title
      postToUpdate.title = 'I dont have to be modified'

      await api
        .put('/api/posts/12345')
        .send(postToUpdate)
        .expect(400)

      const { titles } = await getAllPostTitles()
      expect(titles).toContain(originalTitle)
      expect(titles).toHaveLength(initialPosts.length)
    })
    test('an post that does not exists can not be updated', async () => {
      const postToUpdate = await getFirstPost()
      const originalTitle = postToUpdate.title
      postToUpdate.title = 'I dont have to be modified'

      await api
        .put('/api/posts/6057f6482f086cb6805abb40')
        .send(postToUpdate)
        .expect(404)

      const { titles } = await getAllPostTitles()
      expect(titles).toContain(originalTitle)
      expect(titles).toHaveLength(initialPosts.length)
    })
  })
})

afterAll(() => {
  mongoose.disconnect()
  server.close()
})
