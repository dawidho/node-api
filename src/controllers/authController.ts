import type { Request, Response } from 'express'
import { comparePassword, hashPassword } from '../utils/password.ts'
import { prisma } from '../lib/prisma.ts'
import { generateToken } from '../utils/jwt.ts'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user
      .create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          res.status(409).json({ message: 'Email already in use' })
        }
        throw error
      })

    const token = await generateToken(user)
    res.status(201).json({ message: 'User registered successfully', user, token })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    })
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' })
    }
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'invalid credentials' })
    }

    const token = await generateToken(user)
    delete user.password
    res.status(200).json({ message: 'Login successful', user, token })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500)
  }
}
