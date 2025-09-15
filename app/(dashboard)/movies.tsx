import { addMovie, deleteMovie, getAllMovies, updateMovie } from '@/service/movieService';
import { Movie } from '@/types/movie';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

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
      {/* Header */}
      
      <View style={styles.header}>
        <Text style={styles.title}>🎥 Manage Movies</Text>
        <Text style={styles.subtitle}>Add, edit, and review movies</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Movie</Text>
        </TouchableOpacity>
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
            <View key={movie.id} style={[styles.card, { marginTop: index === 0 ? 0 : 16 }]}>
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
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Movie</Text>
            <TextInput placeholder="Name" placeholderTextColor="#aaa" style={styles.input} value={addName} onChangeText={setAddName} />
            <TextInput placeholder="Director" placeholderTextColor="#aaa" style={styles.input} value={addDirector} onChangeText={setAddDirector} />
            <TextInput placeholder="Genres" placeholderTextColor="#aaa" style={styles.input} value={addGenres} onChangeText={setAddGenres} />
            <TextInput placeholder="Actors" placeholderTextColor="#aaa" style={styles.input} value={addActors} onChangeText={setAddActors} />

            {/* Released Date */}
            <TouchableOpacity onPress={() => { setShowDatePicker(true); setIsForUpdate(false); }} style={styles.input}>
              <Text style={{ color: addReleased ? "#fff" : "#aaa" }}>{addReleased || "Select Release Date"}</Text>
            </TouchableOpacity>
            {showDatePicker && !isForUpdate && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setAddReleased(date.toISOString().split("T")[0]);
                }}
              />
            )}

            <TextInput placeholder="Description" placeholderTextColor="#aaa" style={styles.input} value={addDescription} onChangeText={setAddDescription} />

            {/* IMDb Rating Slider */}
            <Text style={styles.sliderLabel}>IMDB Rating: {addImdbRating.toFixed(1)}</Text>
            <Slider
              minimumValue={0}
              maximumValue={10}
              step={0.1}
              value={addImdbRating}
              onValueChange={setAddImdbRating}
              minimumTrackTintColor="#f59e0b"
              maximumTrackTintColor="#444"
            />

            {/* Image Picker */}
            <TouchableOpacity onPress={() => pickImage(false)} style={styles.imagePicker}>
              <Text style={{ color: "#f59e0b" }}>{addImageUrl ? "Change Image" : "Pick Image"}</Text>
            </TouchableOpacity>
            {addImageUrl ? <Image source={{ uri: addImageUrl }} style={styles.previewImage} /> : null}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddMovie}>
                <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Movie Modal */}
      <Modal visible={updateModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Movie</Text>
            <TextInput placeholder="Name" placeholderTextColor="#aaa" style={styles.input} value={updateName} onChangeText={setUpdateName} />
            <TextInput placeholder="Director" placeholderTextColor="#aaa" style={styles.input} value={updateDirector} onChangeText={setUpdateDirector} />
            <TextInput placeholder="Genres" placeholderTextColor="#aaa" style={styles.input} value={updateGenres} onChangeText={setUpdateGenres} />
            <TextInput placeholder="Actors" placeholderTextColor="#aaa" style={styles.input} value={updateActors} onChangeText={setUpdateActors} />

            {/* Released Date */}
            <TouchableOpacity onPress={() => { setShowDatePicker(true); setIsForUpdate(true); }} style={styles.input}>
              <Text style={{ color: updateReleased ? "#fff" : "#aaa" }}>{updateReleased || "Select Release Date"}</Text>
            </TouchableOpacity>
            {showDatePicker && isForUpdate && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setUpdateReleased(date.toISOString().split("T")[0]);
                }}
              />
            )}

            <TextInput placeholder="Description" placeholderTextColor="#aaa" style={styles.input} value={updateDescription} onChangeText={setUpdateDescription} />

            {/* IMDb Rating Slider */}
            <Text style={styles.sliderLabel}>IMDB Rating: {updateImdbRating.toFixed(1)}</Text>
            <Slider
              minimumValue={0}
              maximumValue={10}
              step={0.1}
              value={updateImdbRating}
              onValueChange={setUpdateImdbRating}
              minimumTrackTintColor="#f59e0b"
              maximumTrackTintColor="#444"
            />

            {/* Image Picker */}
            <TouchableOpacity onPress={() => pickImage(true)} style={styles.imagePicker}>
              <Text style={{ color: "#f59e0b" }}>{updateImageUrl ? "Change Image" : "Pick Image"}</Text>
            </TouchableOpacity>
            {updateImageUrl ? <Image source={{ uri: updateImageUrl }} style={styles.previewImage} /> : null}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateMovie}>
                <Text style={styles.saveButtonText}>{loading ? "Updating..." : "Update"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setUpdateModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  header: { padding: 20, backgroundColor: '#1a1a1a', borderBottomWidth: 1, borderBottomColor: '#333' },
  title: { fontSize: 28, fontWeight: '800', color: '#f59e0b', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#ccc', textAlign: 'center', marginBottom: 16 },
  addButton: { backgroundColor: '#f59e0b', padding: 12, borderRadius: 10, alignSelf: 'center' },
  addButtonText: { color: '#111', fontWeight: '700' },

  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  card: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#333' },
  cardContent: { flexDirection: 'row' },
  imageContainer: { marginRight: 12, borderRadius: 8, overflow: 'hidden' },
  movieImage: { width: 100, height: 140, borderRadius: 8 },
  textContent: { flex: 1 },
  movieTitle: { fontSize: 18, fontWeight: '700', color: '#f59e0b' },
  movieSubtitle: { fontSize: 14, color: '#ccc', marginBottom: 6 },
  movieDescription: { fontSize: 14, color: '#aaa', marginBottom: 8 },
  actionButtons: { flexDirection: 'row', gap: 8 },
  updateButton: { backgroundColor: '#10B981', padding: 6, borderRadius: 6, flex: 1 },
  updateButtonText: { color: '#fff', textAlign: 'center', fontSize: 12 },
  deleteButton: { backgroundColor: '#EF4444', padding: 6, borderRadius: 6, flex: 1 },
  deleteButtonText: { color: '#fff', textAlign: 'center', fontSize: 12 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#ccc' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#f59e0b', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#aaa' },

  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { width: screenWidth * 0.9, backgroundColor: '#1a1a1a', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#f59e0b' },
  input: { borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 10, marginBottom: 10, color: '#fff', backgroundColor: '#111' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  saveButton: { backgroundColor: '#f59e0b', padding: 10, borderRadius: 8, flex: 1, marginRight: 6 },
  saveButtonText: { color: '#111', textAlign: 'center', fontWeight: '700' },
  cancelButton: { backgroundColor: '#333', padding: 10, borderRadius: 8, flex: 1, marginLeft: 6 },
  cancelButtonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  imagePicker: { borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 10 },
  previewImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 10, alignSelf: 'center' },
  sliderLabel: { color: '#ccc', marginBottom: 4 }
});

export default Movies;
