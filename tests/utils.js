// // import { writeFileSync } from 'node:fs'
// // import { join } from 'node:path'
// // const dbPath = join(process.cwd(), 'db.json')
// // const restoreDb = () => writeFileSync(dbPath, JSON.stringify([]))
// // const populateDb = (data) => writeFileSync(dbPath, JSON.stringify(data))
// // export { restoreDb, populateDb }

// import mongoose from 'mongoose'
// import { Whisper } from '../database.js'

// const ensureDbConnection = async () => {
//     try {
//          if (mongoose.connection.readyState !== 1) {
//              await mongoose.connect(process.env.MONGODB_URI);
//          }
//      } catch (error) {
//          console.error('Error connecting to the database:', error);
//          throw error; // Re-throw the error for handling at a higher level
//      }
// }
 
// const closeDbConnection = async () => {
//     if (mongoose.connection.readyState === 1) {
//         await mongoose.disconnect()
//     }
// }

// const restoreDb = () => Whisper.deleteMany({})
// const populateDb = () => Whisper.insertMany([{ message: 'test' }, { message: 'hello world' }])
// const getFixtures = async () => {
//     const data = await Whisper.find()
//     const whispers = JSON.parse(JSON.stringify(data))
//     const inventedId = '64e0e5c75a4a3c715b7c1074'
//     const existingId = data[0].id
//     return { inventedId, existingId, whispers }
// }

// const normalize = (data) => JSON.parse(JSON.stringify(data))

// import jwt from 'jsonwebtoken'

// export function checkPasswordStrength (password) {
//   // Minimum eight characters, at least one letter, one number and one special character:
//   const strengthRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
//   return strengthRegex.test(password)
// }

// export function generateToken (data) {
//   return jwt.sign({
//     data
//   }, process.env.JWT_SECRET, { expiresIn: '1h' })
// }

// export function requireAuthentication (req, res, next) {
//   const token = req.headers.authentication
//   if (!token) {
//     res.status(401).json({ error: 'No token provided' })
//     return
//   }
//   try {
//     const accessToken = token.split(' ')[1]
//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
//     req.user = decoded.data
//     next()
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' })
//   }
// }

// export { restoreDb, populateDb, getFixtures, ensureDbConnection, normalize, closeDbConnection }


import mongoose from 'mongoose'
import {
  Whisper,
  User
} from '../database.js'
import { generateToken } from '../utils.js'

const ensureDbConnection = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI)
    }
  } catch (error) {
    console.error('Error connecting to the database:', error)
    throw error
  }
}
const closeDbConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect()
  }
}
const restoreDb = async () => {
  await Whisper.deleteMany({})
  await User.deleteMany({})
}

const getUsersFixtures = () => [
  { username: 'jane_doe', password: 'qg82H0Zt1Ee6F2ESNwI!ZN8iq7N', email: 'jane@doe.com' },
  { username: 'joe_doe', password: 'nnO864BTxe#103Hl8eI!Qx#0xCw', email: 'joe@doe.com' }
]

const populateDb = async () => {
  const users = []
  for (const user of getUsersFixtures()) {
    const storedUser = await User.create(user)
    users.push(storedUser)
  }

  const messages = [
    { message: 'Jane testing', author: users[0]._id },
    { message: 'hello world from Joe', author: users[0]._id }
  ]

  for (const message of messages) {
    await Whisper.create(message)
  }
}
const getFixtures = async () => {
  const data = await Whisper.find().populate('author', 'username')
  const whispers = JSON.parse(JSON.stringify(data))
  const inventedId = '64e0e5c75a4a3c715b7c1074'
  const existingId = data[0].id
  const storedUsers = await User.find({})
  const [firstUser, secondUser] = getUsersFixtures()
  firstUser.id = storedUsers[0]._id.toString()
  secondUser.id = storedUsers[1]._id.toString()
  firstUser.token = generateToken({ id: firstUser.id, username: firstUser.username })
  secondUser.token = generateToken({ id: secondUser.id, username: secondUser.username })
  return { inventedId, existingId, whispers, firstUser, secondUser }
}
const normalize = (data) => JSON.parse(JSON.stringify(data))

export { restoreDb, populateDb, getFixtures, ensureDbConnection, normalize, closeDbConnection }

