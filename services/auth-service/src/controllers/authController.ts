import { Request, Response } from 'express'
import { comparePassword, hashPassword } from '../utils/password.js'
import { prisma } from '../lib/prisma.js'
import { chargeUserOnLogin } from '../services/paymentService.js'
import axios from 'axios'

// Import JWT from shared library (relative path for now)
import { JwtService } from '../../../shared/src/jwt.js'

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002'
const jwtService = new JwtService()

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
        if ((error as any).code === 'P2002') {
          res.status(409).json({ message: 'Email already in use' })
        }
        throw error
      })

    // Direct HTTP sync with User Service
    try {
      await axios.post(`${USER_SERVICE_URL}/api/users/sync`, {
        id: user.id,
        email: user.email,
        name: user.name,
      })
    } catch (error) {
      console.error('Failed to sync with User Service via HTTP:', error)
    }

    const token = await jwtService.generateToken({
      id: user.id,
      email: user.email,
      username: user.name,
    })

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.name },
      token,
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
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
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Charge $1 via Payment Service (HTTP)
    try {
      await chargeUserOnLogin(user.id, user.email, user.name)
      console.log(`User ${user.id} charged $1 for login`)
    } catch (error) {
      console.error('Failed to charge user on login:', error)
      // Continue with login even if charge fails
    }

    const token = await jwtService.generateToken({
      id: user.id,
      email: user.email,
      username: user.name,
    })

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
