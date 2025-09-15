import { Timestamp } from "firebase/firestore"

export interface Movie {
  id: string 
  name: string
  director: string
  genres: string
  actors: string
  released: string
  description: string
  imdbRating: number
  imageUrl?: string;
  userId: string
  createdAt: string | Timestamp;
  updatedAt?: string | Timestamp;
}
