import { IPost } from '@models/Post'

const supertest = require('supertest')
const { app } = require('@app')

const api = supertest(app)
const userId = require('mongoose').Types.ObjectId();

const getAllPostTitles = async () => {
  const response = await api.get('/api/posts')
  return {
    titles: response.body.map((p: IPost) => p.title),
    posts: response
  }
}

const initialPosts = [
  {
    title: 'Post 1',
    date: new Date().toISOString(),
    description: 'lorem sdfsdf sdfsdf sdfsdf sdf',
    image: 'https://source.unsplash.com/random',
    author: userId
  },
  {
    title: 'Post 2',
    date: new Date().toISOString(),
    description: 'lorem sdfsdf sdfsdf sdfsdf sdf',
    image: 'https://source.unsplash.com/random',
    author: userId
  }
]
const newPost = {
  title: 'Post new',
  date: new Date().toISOString(),
  description: 'lorem sdfsdf sdfsdf sdfsdf sdf',
  image: 'https://source.unsplash.com/random',
  author: userId
}

const getFirstPost = async () => {
  const allPosts = await api.get('/api/posts')
  return allPosts.body[0]
}

export {
  api,
  initialPosts,
  getAllPostTitles,
  newPost,
  getFirstPost
}
