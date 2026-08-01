import { Buffer } from 'node:buffer'
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export function hashPassword(password) {
  const salt = randomBytes(16)
  const derived = scryptSync(String(password), salt, 64)
  return `scrypt:${salt.toString('hex')}:${derived.toString('hex')}`
}

export function verifyPassword(password, encoded) {
  const [algorithm, saltHex, hashHex] = String(encoded).split(':')
  if (algorithm !== 'scrypt' || !saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(String(password), Buffer.from(saltHex, 'hex'), expected.length)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export function newSessionToken() {
  return randomBytes(32).toString('base64url')
}

export function newCsrfToken() {
  return randomBytes(24).toString('base64url')
}

export function tokenDigest(token) {
  return createHash('sha256').update(String(token)).digest('hex')
}

export function safeTokenEqual(actual, expected) {
  const left = Buffer.from(tokenDigest(actual))
  const right = Buffer.from(tokenDigest(expected))
  return left.length === right.length && timingSafeEqual(left, right)
}

export function parseCookies(header) {
  const cookies = {}
  for (const part of String(header ?? '').split(';')) {
    const index = part.indexOf('=')
    if (index < 1) continue
    const key = part.slice(0, index).trim()
    const value = part.slice(index + 1).trim()
    try {
      cookies[key] = decodeURIComponent(value)
    } catch {
      cookies[key] = value
    }
  }
  return cookies
}
