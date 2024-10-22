// import fs from 'node:fs/promises'
// import path from 'node:path'

// const filename = path.join(process.cwd(), 'db.json')
// const saveChanges = data => fs.writeFile(filename, JSON.stringify(data))

// const readData = async () => {
//   const data = await fs.readFile(filename, 'utf-8')
//   return JSON.parse(data)
// }

// const getAll = readData
// const getById = async (id) => {
//   const data = await readData()
//   return data.find(item => item.id === id)
// }

// const create = async (message) => {
//   const data = await readData()
//   const newItem = { message, id: data.length + 1 }
//   await saveChanges(data.concat([newItem]))
//   return newItem
// }

// const updateById = async (id, message) => {
//   const data = await readData()
//   const newData = data.map(current => {
//     if (current.id === id) {
//       return { ...current, message }
//     }
//     return current
//   })
//   await saveChanges(newData)
// }

// const deleteById = async id => {
//   const data = await readData()
//   await saveChanges(data
//     .filter(current => current.id !== id)
//   )
// }

import { Whisper } from './database.js'

const getAll = () => Whisper.find()
const getById = id => Whisper.findById({ _id: id })

const create = async (message) => {
  const whisper = new Whisper({ message })
  await whisper.save()
  return whisper
}
const updateById = async (id, message) => Whisper.findOneAndUpdate({ _id: id }, { message }, { new: false })
const deleteById = async (id) => Whisper.deleteOne({ _id: id })

export { getAll, getById, create, updateById, deleteById }
