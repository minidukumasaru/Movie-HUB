import { Timestamp } from "firebase/firestore"

export interface Movie {
  id?: string 
  name: string
  director: string
  genres: string
  actors: string
  released: string
  description: string
  imdbRating: number
  language: string
  userId: string
  createdAt: Timestamp
}
