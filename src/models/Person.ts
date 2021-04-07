import { Schema, model, Document } from 'mongoose'

export interface IPerson extends Document {
  name: string
  lastname: string
  email: string
  posts?: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ];
  birthDate?: Date;
}

const PersonSchema: Schema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  posts: { type: Array, required: false },
  birthDate: { type: Date, required: false }
})
PersonSchema.set('toJSON', {
  transform: (document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = model('Person', PersonSchema)


export default Person
