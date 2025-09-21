import { useAuth } from "@/context/AuthContext";
import { Movie } from "@/types/movie";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  loading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      loadFavorites(user.uid);
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  const getFavoritesKey = (userId: string) => `favorites_${userId}`;


  const loadFavorites = async (userId: string) => {
    try {
      setLoading(true);
      const key = getFavoritesKey(userId);
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (userId: string, favoritesList: string[]) => {
    try {
      const key = getFavoritesKey(userId);
      await AsyncStorage.setItem(key, JSON.stringify(favoritesList));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (movie: Movie) => {
    if (!user) return;

    setFavorites((prev) => {
      const newFavorites = prev.includes(movie.id)
        ? prev.filter((id) => id !== movie.id)
        : [...prev, movie.id];
      
      // Save to AsyncStorage
      saveFavorites(user.uid, newFavorites);
      
      return newFavorites;
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const clearFavorites = async () => {
    if (!user) return;
    
    try {
      const key = getFavoritesKey(user.uid);
      await AsyncStorage.removeItem(key);
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  return (
    <FavoritesContext.Provider 
      value={{ 
        favorites, 
        toggleFavorite, 
        isFavorite, 
        clearFavorites,
        loading 
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};