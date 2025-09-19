// src/service/movieService.ts
import { db } from "@/firebase"
import { Movie } from "@/types/movie"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore"

export const moviesRef = collection(db, "movies")

// CREATE
export const addMovie = async (movie: Omit<Movie, "id">) => {
  await addDoc(moviesRef, movie)
}

// READ
export const getAllMovies = async (): Promise<Movie[]> => {
  const snapshot = await getDocs(moviesRef)
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Movie)
  )
}

// UPDATE
export const updateMovie = async (id: string, movie: Partial<Movie>) => {
  console.log("Updating movie with id:", id, "and data:", movie)
  const docRef = doc(db, "movies", id)
  await updateDoc(docRef, movie)
}

// DELETE
export const deleteMovie = async (id: string) => {
  console.log("Deleting movie with id:", id)
  const docRef = doc(db, "movies", id)
  await deleteDoc(docRef)
}

// SEARCH
export const searchMovies = async (query: string): Promise<Movie[]> => {
  const snapshot = await getDocs(moviesRef)
  const allMovies = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Movie)
  )

  const lowerQuery = query.toLowerCase()

  return allMovies.filter((movie) => {
    const createdAtStr =
      typeof movie.createdAt === "string"
        ? movie.createdAt
        : movie.createdAt?.toDate().toDateString() ?? ""

    const updatedAtStr =
      typeof movie.updatedAt === "string"
        ? movie.updatedAt
        : movie.updatedAt?.toDate().toDateString() ?? ""

    return (
      movie.id.toLowerCase().includes(lowerQuery) ||
      movie.name.toLowerCase().includes(lowerQuery) ||
      movie.director.toLowerCase().includes(lowerQuery) ||
      movie.genres.toLowerCase().includes(lowerQuery) ||
      movie.actors.toLowerCase().includes(lowerQuery) ||
      movie.description.toLowerCase().includes(lowerQuery) ||
      // movie.language.toLowerCase().includes(lowerQuery) ||
      movie.imdbRating.toString().includes(lowerQuery) ||
      movie.released.toLowerCase().includes(lowerQuery) ||
      movie.userId.toLowerCase().includes(lowerQuery) ||
      createdAtStr.toLowerCase().includes(lowerQuery) ||
      updatedAtStr.toLowerCase().includes(lowerQuery)
    )
  })
}
