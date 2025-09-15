import { db } from "@/firebase"; // adjust import path
import { Book } from "@/types/movie"; // your Book interface
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const booksRef = collection(db, "books");

export const BookService = {
  // CREATE
addBook: async (book: Omit<Book, "id" | "createdAt">) => {
  const docRef = await addDoc(booksRef, {
    ...book,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id };
},


  // READ (all books by user)
  getBooksByUser: async (userId: string): Promise<Book[]> => {
    const q = query(booksRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Book),
    }));
  },

  // UPDATE
  updateBook: async (id: string, data: Partial<Book>) => {
    const bookDoc = doc(db, "books", id);
    await updateDoc(bookDoc, data);
  },

  // DELETE
  deleteBook: async (id: string) => {
    const bookDoc = doc(db, "books", id);
    await deleteDoc(bookDoc);
  },
};
