// app/favorites.tsx
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { getAllMovies } from "@/service/movieService";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, toggleFavorite, isFavorite, loading: favLoading } = useFavorites();
  
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (user && !favLoading) {
      fetchMovies();
    } else if (!authLoading && !user) {
      setAllMovies([]);
      setLoading(false);
    }
  }, [user, authLoading, favLoading]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const movies = await getAllMovies();
      setAllMovies(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter movies to show only favorites from all users (not just current user's movies)
  const favMovies = allMovies.filter((m) => favorites.includes(m.id));

  // Show loading while checking auth or loading favorites
  if (authLoading || favLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  // Show login required message
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#F59E0B" />
        <Text style={styles.emptyTitle}>Please log in</Text>
        <Text style={styles.emptySubtitle}>
          You need to be logged in to view your favorites
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Hero Header */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={require("../../assets/images/screen-0.jpg")}
          resizeMode="cover"
          style={styles.heroBg}
        >
          <View style={styles.overlay} />
          <View style={styles.heroContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="film-outline" size={36} color="#fff" />
            </View>

            <View style={styles.logoRow}>
              <Text style={styles.movieText}>Movie</Text>
              <View style={styles.hubBox}>
                <Text style={styles.hubText}>Hub</Text>
              </View>
            </View>

            <Text style={styles.tagline}>Your Favorite Movies ❤</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.favoriteCount}>
              {favMovies.length} favorite{favMovies.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Favorite Movies */}
      {favMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Mark movies with ❤ to see them here.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.movieList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {favMovies.map((movie, index) => (
            <TouchableOpacity
              key={movie.id}
              style={[styles.movieCard, { marginTop: index === 0 ? 0 : 16 }]}
              activeOpacity={0.9}
              onPress={() => setSelectedMovie(movie)}
            >
              {/* Poster */}
              {movie.imageUrl && (
                <Image
                  source={{ uri: movie.imageUrl }}
                  style={styles.poster}
                  resizeMode="cover"
                />
              )}

              {/* Info */}
              <View style={styles.infoSection}>
                <Text style={styles.title} numberOfLines={2}>
                  {movie.name}
                </Text>
                <Text style={styles.meta}>
                  🎬 {movie.director} | ⭐ {movie.imdbRating}
                </Text>
                <Text style={styles.meta}>
                  {movie.genres} | {movie.released}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                  {movie.description}
                </Text>
                
                {/* Show if it's user's own movie */}
                {movie.userId === user.uid && (
                  <View style={styles.ownMovieBadge}>
                    <Text style={styles.ownMovieText}>Your Movie</Text>
                  </View>
                )}
              </View>

              {/* ❤ Favorite Toggle */}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(movie)}
              >
                <Ionicons
                  name={isFavorite(movie.id) ? "heart" : "heart-outline"}
                  size={20}
                  color={isFavorite(movie.id) ? "red" : "#aaa"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <View style={{ height: 30 }} />
        </ScrollView>
      )}

      {/* Movie Preview Modal */}
      {selectedMovie && (
        <Modal
          visible={true}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setSelectedMovie(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Close button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedMovie(null)}
              >
                <Ionicons name="close" size={26} color="#fff" />
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedMovie.imageUrl && (
                  <Image
                    source={{ uri: selectedMovie.imageUrl }}
                    style={styles.modalPoster}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedMovie.name}</Text>
                  <TouchableOpacity
                    style={styles.modalFavoriteButton}
                    onPress={() => toggleFavorite(selectedMovie)}
                  >
                    <Ionicons
                      name={isFavorite(selectedMovie.id) ? "heart" : "heart-outline"}
                      size={24}
                      color={isFavorite(selectedMovie.id) ? "red" : "#aaa"}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalMeta}>
                  🎬 {selectedMovie.director} | ⭐ {selectedMovie.imdbRating}
                </Text>
                <Text style={styles.modalMeta}>
                  {selectedMovie.genres} | {selectedMovie.released}
                </Text>
                <Text style={styles.modalMeta}>👥 {selectedMovie.actors}</Text>
                
                {selectedMovie.userId === user.uid && (
                  <View style={styles.ownMovieBadgeModal}>
                    <Text style={styles.ownMovieTextModal}>This is your movie</Text>
                  </View>
                )}
                
                <Text style={styles.modalDescription}>
                  {selectedMovie.description}
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505" },
  heroContainer: {
    height: screenHeight * 0.32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginBottom: 16,
  },
  heroBg: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  heroContent: { alignItems: "center", zIndex: 2 },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  movieText: { fontSize: 32, fontWeight: "900", color: "#fff" },
  hubBox: {
    backgroundColor: "#f59e0b",
    marginLeft: 8,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  hubText: { fontSize: 30, fontWeight: "900", color: "#000" },
  tagline: { fontSize: 13, color: "#fff", marginTop: 8, textAlign: "center" },
  userEmail: { 
    fontSize: 12, 
    color: "#f59e0b", 
    marginTop: 4, 
    textAlign: "center" 
  },
  favoriteCount: {
    fontSize: 11,
    color: "#ccc",
    marginTop: 2,
    textAlign: "center",
  },
  movieList: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 20 },
  movieCard: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 12,
    position: "relative",
    borderWidth: 1,
    borderColor: "#333",
  },
  poster: { width: 100, height: 150, borderRadius: 10, marginRight: 14 },
  infoSection: { flex: 1, justifyContent: "center" },
  title: { fontSize: 18, fontWeight: "700", color: "#f59e0b" },
  meta: { fontSize: 13, color: "#9ca3af", marginBottom: 2 },
  description: { fontSize: 13, color: "#d1d5db", marginTop: 4 },
  ownMovieBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  ownMovieText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  favoriteButton: { position: "absolute", top: -4, right: 1, padding: 6 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050505",
  },
  loadingText: { marginTop: 12, color: "#9ca3af", fontSize: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyIcon: { fontSize: 48, marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: "700", color: "#fff" },
  emptySubtitle: { 
    fontSize: 14, 
    color: "#9ca3af", 
    textAlign: "center",
    marginTop: 8,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  modalPoster: {
    width: "100%",
    height: screenHeight * 0.55,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#000",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#f59e0b",
    flex: 1,
    marginRight: 10,
  },
  modalFavoriteButton: {
    padding: 4,
  },
  modalMeta: { fontSize: 14, color: "#9ca3af", marginBottom: 4 },
  ownMovieBadgeModal: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginVertical: 8,
  },
  ownMovieTextModal: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  modalDescription: {
    fontSize: 15,
    color: "#d1d5db",
    marginTop: 8,
    lineHeight: 22,
  },
});