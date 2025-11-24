import { Router } from 'express'

const userRouter = Router()

const DUMMY_USERS = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@doe.com',
    password: 'securepassword',
  },
  {
    id: 2,
    name: 'Jan Pawel',
    email: 'jan@pawel.drugi',
    password: 'awesomeapi',
  },
]

userRouter.get('/', (req, res) => {
  res.send('User endpoint is working')
})

userRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const user = DUMMY_USERS.find((u) => u.id === parseInt(id))
  if (user) res.json(user)
  else res.status(404).json({ message: 'User not found' })
})

userRouter.put('/:id', (req, res) => {
  const { id } = req.params

  res.json({ message: `User ${id} updated` })
})

userRouter.delete('/:id', (req, res) => {
  const { id } = req.params

  res.json({ message: `User ${id} deleted` })
})

export { userRouter }
