import bcrypt from 'bcrypt'
import env from '../../env'

export const hashPassword = async (password: string) => bcrypt.hash(password, env.BCRYPT_ROUNDS)
export const comparePassword = (password: string, hashedPassword: string) =>
  bcrypt.compare(password, hashedPassword)
