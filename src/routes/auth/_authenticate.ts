import jwt from 'jsonwebtoken'

export default function authenticate(token: string): boolean {
  let authenticated = false

  jwt.verify(token, `${import.meta.env.VITE_JWT_KEY}`, error => {
    if (error) {
      console.error(`authentication failed`, error)
    } else {
      authenticated = true
    }
  })

  return authenticated
}