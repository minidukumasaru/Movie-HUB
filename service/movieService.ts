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
