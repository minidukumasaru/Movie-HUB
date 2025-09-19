// Home.tsx
import { getAllMovies, searchMovies } from "@/service/movieService";
import { Movie } from "@/types/movie";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const allMovies = await getAllMovies();
      setMovies(allMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      fetchMovies();
    } else {
      const results = await searchMovies(text);
      setMovies(results);
    }
  };

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

      {/* Hero Header Section */}
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

            <Text style={styles.tagline}>
              Discover. Review. Share your favorites.
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Movies */}
      {movies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎬</Text>
          <Text style={styles.emptyTitle}>No movies found</Text>
          <Text style={styles.emptySubtitle}>
            Try searching with different keywords.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.movieList}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {movies.map((movie, index) => (
            <View
              key={movie.id}
              style={[styles.movieCard, { marginTop: index === 0 ? 0 : 16 }]}
            >
              <View style={styles.cardAccent} />

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
              </View>
            </View>
          ))}

          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },

  // Header
  heroContainer: {
    height: screenHeight * 0.32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginBottom: 16,
  },
  heroBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  heroContent: {
    alignItems: "center",
    zIndex: 2,
  },
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
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  movieText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
  },
  hubBox: {
    backgroundColor: "#f59e0b",
    marginLeft: 8,
    borderRadius: 6,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  hubText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#000",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    marginTop: 8,
    textAlign: "center",
  },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f10",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 8,
  },

  // Movie List
  movieList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  movieCard: {
    flexDirection: "row",
    backgroundColor: "#0f0f10",
    borderRadius: 16,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    position: "relative",
  },
  cardAccent: {
    position: "absolute",
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    backgroundColor: "#f59e0b",
    borderRadius: 2,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 14,
  },
  infoSection: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: "#d1d5db",
    marginTop: 4,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050505",
  },
  loadingText: {
    marginTop: 12,
    color: "#9ca3af",
    fontSize: 16,
  },

  // Empty
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});

export default Home;
