import { describe, expect, it } from 'vitest'
import { comparePassword, hashPassword } from '../../utils/password'

describe('password utils', () => {
  it('should hash and compare password correctly', async () => {
    const password = 'supersecret'
    const hash = await hashPassword(password)
    expect(hash).not.toBe(password)
    const isMatch = await comparePassword(password, hash)
    expect(isMatch).toBe(true)
  })

  it('should fail to compare wrong password', async () => {
    const password = 'supersecret'
    const hash = await hashPassword(password)
    const isMatch = await comparePassword('wrong', hash)
    expect(isMatch).toBe(false)
  })
})
