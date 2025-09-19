import { addMovie, deleteMovie, getAllMovies, updateMovie } from '@/service/movieService';
import { Movie } from '@/types/movie';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: screenWidth, height } = Dimensions.get('window');

const Movies = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Add form states
  const [addName, setAddName] = useState('');
  const [addDirector, setAddDirector] = useState('');
  const [addGenres, setAddGenres] = useState('');
  const [addActors, setAddActors] = useState('');
  const [addReleased, setAddReleased] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addImdbRating, setAddImdbRating] = useState(5);
  const [addImageUrl, setAddImageUrl] = useState('');

  // Update form states
  const [updateName, setUpdateName] = useState('');
  const [updateDirector, setUpdateDirector] = useState('');
  const [updateGenres, setUpdateGenres] = useState('');
  const [updateActors, setUpdateActors] = useState('');
  const [updateReleased, setUpdateReleased] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateImdbRating, setUpdateImdbRating] = useState(5);
  const [updateImageUrl, setUpdateImageUrl] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isForUpdate, setIsForUpdate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setFetchLoading(true);
      const allMovies = await getAllMovies();
      setMovies(allMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const pickImage = async (isUpdate = false) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (isUpdate) {
        setUpdateImageUrl(result.assets[0].uri);
      } else {
        setAddImageUrl(result.assets[0].uri);
      }
    }
  };

  const handleAddMovie = async () => {
    if (!addName.trim() || !addDirector.trim() || !addDescription.trim()) {
      Alert.alert('Error', 'Please fill in required fields: name, director, description');
      return;
    }

    try {
      setLoading(true);
      const newMovie: Omit<Movie, "id"> = {
        name: addName.trim(),
        director: addDirector.trim(),
        genres: addGenres.trim(),
        actors: addActors.trim(),
        released: addReleased.trim(),
        description: addDescription.trim(),
        imdbRating: addImdbRating,
        imageUrl: addImageUrl.trim() || undefined,
        userId: "demo-user",
        createdAt: new Date().toISOString(),
      };

      await addMovie(newMovie);

      setAddName('');
      setAddDirector('');
      setAddGenres('');
      setAddActors('');
      setAddReleased('');
      setAddDescription('');
      setAddImdbRating(5);
      setAddImageUrl('');
      setAddModalVisible(false);

      await fetchMovies();
      Alert.alert('Success', 'Movie added successfully!');
    } catch (error) {
      console.error('Error adding movie:', error);
      Alert.alert('Error', 'Failed to add movie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMovie = async () => {
    if (!updateName.trim() || !updateDirector.trim() || !updateDescription.trim() || !selectedMovie) {
      Alert.alert('Error', 'Please fill in required fields: name, director, description');
      return;
    }

    Alert.alert(
      "Confirm Update",
      "Are you sure you want to update this movie?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Update",
          style: "default",
          onPress: async () => {
            try {
              setLoading(true);
              const updatedMovie: Partial<Movie> = {
                name: updateName.trim(),
                director: updateDirector.trim(),
                genres: updateGenres.trim(),
                actors: updateActors.trim(),
                released: updateReleased.trim(),
                description: updateDescription.trim(),
                imdbRating: updateImdbRating,
                imageUrl: updateImageUrl.trim() || undefined,
                updatedAt: new Date().toISOString(),
              };

              await updateMovie(selectedMovie.id, updatedMovie);

              setUpdateModalVisible(false);
              setSelectedMovie(null);

              await fetchMovies();
              Alert.alert('Success', 'Movie updated successfully!');
            } catch (error) {
              console.error('Error updating movie:', error);
              Alert.alert('Error', 'Failed to update movie. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDeleteMovie = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this movie?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMovie(id);
              await fetchMovies();
              Alert.alert("Deleted", "Movie deleted successfully.");
            } catch (error) {
              console.error('Error deleting movie:', error);
              Alert.alert("Error", "Failed to delete movie. Try again.");
            }
          }
        }
      ]
    );
  };

  const openUpdateModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setUpdateName(movie.name);
    setUpdateDirector(movie.director);
    setUpdateGenres(movie.genres);
    setUpdateActors(movie.actors);
    setUpdateReleased(movie.released);
    setUpdateDescription(movie.description);
    setUpdateImdbRating(movie.imdbRating);
    setUpdateImageUrl(movie.imageUrl || '');
    setUpdateModalVisible(true);
  };

  if (fetchLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
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
            <Text style={styles.tagline}>Discover. Review. Share your favorites.</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+ Add Movie</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* Movies List */}
      {movies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No movies added yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap "Add Movie" to add your first one!
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {movies.map((movie, index) => (
            <View
              key={movie.id}
              style={[styles.card, { marginTop: index === 0 ? 0 : 16 }]}
            >
              <View style={styles.cardContent}>
                {movie.imageUrl && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: movie.imageUrl }}
                      style={styles.movieImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
                <View style={styles.textContent}>
                  <Text style={styles.movieTitle} numberOfLines={2}>
                    {movie.name} ({movie.released})
                  </Text>
                  <Text style={styles.movieSubtitle}>
                    🎬 {movie.director} | ⭐ {movie.imdbRating}
                  </Text>
                  <Text style={styles.movieDescription} numberOfLines={3}>
                    {movie.description}
                  </Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.updateButton}
                      onPress={() => openUpdateModal(movie)}
                    >
                      <Text style={styles.updateButtonText}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMovie(movie.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add Movie Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Movie</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={addName}
              onChangeText={setAddName}
            />
            <TextInput
              style={styles.input}
              placeholder="Director"
              placeholderTextColor="#999"
              value={addDirector}
              onChangeText={setAddDirector}
            />
            <TextInput
              style={styles.input}
              placeholder="Genres (e.g., Action, Sci-Fi)"
              placeholderTextColor="#999"
              value={addGenres}
              onChangeText={setAddGenres}
            />
            <TextInput
              style={styles.input}
              placeholder="Actors (comma-separated)"
              placeholderTextColor="#999"
              value={addActors}
              onChangeText={setAddActors}
            />
            <TextInput
              style={styles.input}
              placeholder="Released Year"
              placeholderTextColor="#999"
              value={addReleased}
              onChangeText={setAddReleased}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={addDescription}
              onChangeText={setAddDescription}
            />
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>IMDb Rating: {addImdbRating}</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setAddImdbRating(star)}
                  >
                    <Ionicons
                      name={star <= addImdbRating ? 'star' : 'star-outline'}
                      size={24}
                      color="#f59e0b"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.imagePickerButton} onPress={() => pickImage()}>
              <Text style={styles.imagePickerButtonText}>Choose Image</Text>
            </TouchableOpacity>
            {addImageUrl ? (
              <Image source={{ uri: addImageUrl }} style={styles.modalImagePreview} />
            ) : null}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddMovie} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#111" />
                ) : (
                  <Text style={styles.modalButtonText}>Add Movie</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalCloseButton]} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Movie Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={updateModalVisible}
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Movie</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={updateName}
              onChangeText={setUpdateName}
            />
            <TextInput
              style={styles.input}
              placeholder="Director"
              placeholderTextColor="#999"
              value={updateDirector}
              onChangeText={setUpdateDirector}
            />
            <TextInput
              style={styles.input}
              placeholder="Genres (e.g., Action, Sci-Fi)"
              placeholderTextColor="#999"
              value={updateGenres}
              onChangeText={setUpdateGenres}
            />
            <TextInput
              style={styles.input}
              placeholder="Actors (comma-separated)"
              placeholderTextColor="#999"
              value={updateActors}
              onChangeText={setUpdateActors}
            />
            <TextInput
              style={styles.input}
              placeholder="Released Year"
              placeholderTextColor="#999"
              value={updateReleased}
              onChangeText={setUpdateReleased}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={updateDescription}
              onChangeText={setUpdateDescription}
            />
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>IMDb Rating: {updateImdbRating}</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setUpdateImdbRating(star)}
                  >
                    <Ionicons
                      name={star <= updateImdbRating ? 'star' : 'star-outline'}
                      size={24}
                      color="#f59e0b"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.imagePickerButton} onPress={() => pickImage(true)}>
              <Text style={styles.imagePickerButtonText}>Choose Image</Text>
            </TouchableOpacity>
            {updateImageUrl ? (
              <Image source={{ uri: updateImageUrl }} style={styles.modalImagePreview} />
            ) : null}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={handleUpdateMovie} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#111" />
                ) : (
                  <Text style={styles.modalButtonText}>Update Movie</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalCloseButton]} onPress={() => setUpdateModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },

  /** HERO HEADER **/
  heroContainer: {
    height: height * 0.35,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginBottom: 12,
  },
  heroBg: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  heroContent: { alignItems: "center", paddingHorizontal: 16 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  movieText: { fontSize: 32, fontWeight: "900", color: "#fff" },
  hubBox: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  hubText: { fontSize: 28, fontWeight: "900", color: "#111" },
  tagline: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 6,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 14,
  },
  addButtonText: { color: "#111", fontWeight: "700" },

  /** MOVIE CARDS **/
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 16
  },
  cardContent: { flexDirection: "row" },
  imageContainer: { marginRight: 12, borderRadius: 8, overflow: "hidden" },
  movieImage: { width: 100, height: 140, borderRadius: 8 },
  textContent: { flex: 1 },
  movieTitle: { fontSize: 18, fontWeight: "700", color: "#f59e0b" },
  movieSubtitle: { fontSize: 14, color: "#ccc", marginBottom: 6 },
  movieDescription: { fontSize: 14, color: "#aaa", marginBottom: 8 },
  actionButtons: { flexDirection: "row", gap: 8 },
  updateButton: {
    backgroundColor: "#10B981",
    padding: 6,
    borderRadius: 6,
    flex: 1,
  },
  updateButtonText: { color: "#fff", textAlign: "center", fontSize: 12 },
  deleteButton: {
    backgroundColor: "#EF4444",
    padding: 6,
    borderRadius: 6,
    flex: 1,
  },
  deleteButtonText: { color: "#fff", textAlign: "center", fontSize: 12 },

  /** EMPTY LIST **/
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f59e0b",
    marginBottom: 8,
  },
  emptySubtitle: { fontSize: 14, color: "#aaa" },

  /** LOADING **/
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#ccc" },

  /** MODALS **/
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ratingText: {
    color: '#ccc',
    fontSize: 16,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  imagePickerButton: {
    backgroundColor: '#f59e0b',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerButtonText: {
    color: '#111',
    fontWeight: '600',
  },
  modalImagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalCloseButton: {
    backgroundColor: '#aaa',
  },
  modalButtonText: {
    color: '#111',
    fontWeight: '700',
  },
});

export default Movies;