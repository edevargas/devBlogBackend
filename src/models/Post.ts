import { Schema, model, Document } from 'mongoose'

export interface IPost extends Document {
  title: string
  date: Date
  description: string
  image: string
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Person'
  }
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  author: { type: Schema.Types.ObjectId, required: true },
  image: { type: String, required: true }
})
PostSchema.set('toJSON', {
  transform: (document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Post = model('Post', PostSchema)


export default Post
