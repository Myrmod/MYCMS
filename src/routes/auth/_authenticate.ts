import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

export default function authenticate(token: string): boolean {
  let authenticated = false

  jwt.verify(token, `${dotenv.config().parsed.JWT_KEY}`, error => {
    if (error) {
      console.error(`authentication failed`, error)
    } else {
      authenticated = true
    }
  })

  return authenticated
}
