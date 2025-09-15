
import { auth } from "@/firebase";
import { BookService } from "@/service/movieService";
import { Book } from "@/types/book";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,@/types/movie
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get('window');

interface EnhancedBook extends Book {
  coverImage?: string;
  description?: string;
}

export default function BooksScreen() {
  const userId = auth.currentUser?.uid ?? "guest";
  const [books, setBooks] = useState<EnhancedBook[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Camera related states
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  const loadBooks = async () => {
    try {
      const data = await BookService.getBooksByUser(userId);
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setGenre("");
    setDescription("");
    setNotes("");
    setCoverImage("");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!title || !author) {
      Alert.alert("Validation", "Please enter title and author");
      return;
    }

    try {
      const bookData = {
        title,
        author,
        genre,
        description,
        notes,
        coverImage,
        userId
      };

      if (editingId) {
        await BookService.updateBook(editingId, bookData);
        Alert.alert("Updated", "Book updated successfully");
      } else {
        await BookService.addBook(bookData);
        Alert.alert("Added", "Book added successfully");
      }
      clearForm();
      loadBooks();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save book");
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await BookService.deleteBook(id);
              loadBooks();
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete book");
            }
          }
        }
      ]
    );
  };

  const handleEditBook = (item: EnhancedBook) => {
    setTitle(item.title);
    setAuthor(item.author);
    setGenre(item.genre || "");
    setDescription(item.description || "");
    setNotes(item.notes || "");
    setCoverImage(item.coverImage || "");
    setEditingId(item.id!);
  };

  const showImageOptions = () => {
    Alert.alert(
      "Add Cover Image",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: pickFromGallery }
      ]
    );
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permission denied", "Camera permission is required");
        return;
      }
    }
    
    if (!mediaPermission?.granted) {
      const result = await requestMediaPermission();
      if (!result.granted) {
        Alert.alert("Permission denied", "Media library permission is required");
        return;
      }
    }
    
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        setCoverImage(photo.uri);
        setShowCamera(false);
        
        // Optionally save to gallery
        try {
          const asset = await MediaLibrary.createAssetAsync(photo.uri);
          await MediaLibrary.createAlbumAsync('BookCovers', asset, false);
        } catch (saveError) {
          console.log("Could not save to gallery:", saveError);
        }
        
        Alert.alert("Photo captured", "Cover image has been set!");
      } catch (err) {
        console.error("Failed to take picture:", err);
        Alert.alert("Error", "Failed to capture photo");
      }
    }
  };

  const pickFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission denied", "Gallery permission is required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4], // Book cover aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCoverImage(result.assets[0].uri);
        Alert.alert("Image selected", "Cover image has been set!");
      }
    } catch (err) {
      console.error("Failed to pick image:", err);
      Alert.alert("Error", "Failed to select image");
    }
  };

  const renderBookItem = ({ item }: { item: EnhancedBook }) => (
    <View style={styles.bookItem}>
      <View style={styles.bookContent}>
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📚</Text>
          </View>
        )}
        
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            by {item.author}
          </Text>
          {item.genre && (
            <Text style={styles.bookGenre} numberOfLines={1}>
              {item.genre}
            </Text>
          )}
          {item.description && (
            <Text style={styles.bookDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
          {item.notes && (
            <Text style={styles.bookNotes} numberOfLines={1}>
              Notes: {item.notes}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.bookActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditBook(item)}
        >
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id!)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>📖 My Book Collection</Text>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Add New Book</Text>
          
          {/* Cover Image Section */}
          <View style={styles.imageSection}>
            {coverImage ? (
              <TouchableOpacity onPress={showImageOptions} style={styles.imageContainer}>
                <Image source={{ uri: coverImage }} style={styles.selectedImage} />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>Tap to change</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={showImageOptions} style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>📷</Text>
                <Text style={styles.imagePlaceholderText}>Add Cover Image</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Book Title *"
            placeholderTextColor="#A855F7"
            value={title}
            onChangeText={setTitle}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Author *"
            placeholderTextColor="#A855F7"
            value={author}
            onChangeText={setAuthor}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Genre"
            placeholderTextColor="#A855F7"
            value={genre}
            onChangeText={setGenre}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor="#A855F7"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Personal Notes"
            placeholderTextColor="#A855F7"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {editingId ? "📝 Update Book" : "➕ Add Book"}
              </Text>
            </TouchableOpacity>
            
            {editingId && (
              <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
                <Text style={styles.cancelButtonText}>✖️ Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Books List Section */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>
            My Books ({books.length})
          </Text>
          
          {books.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📚</Text>
              <Text style={styles.emptyStateText}>No books added yet</Text>
              <Text style={styles.emptyStateSubtext}>Add your first book above!</Text>
            </View>
          ) : (
            <FlatList
              data={books}
              keyExtractor={(item) => item.id!}
              renderItem={renderBookItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
      >
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          />
          
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cameraButtonText}>✖️</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <Text style={styles.captureButtonText}>📸</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
            >
              <Text style={styles.cameraButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8FF", // Light purple background
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6B21A8", // Dark purple
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#6B21A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7C3AED", // Medium purple
    marginBottom: 15,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: 120,
    height: 160,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#A855F7",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(168, 85, 247, 0.8)",
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    paddingVertical: 4,
  },
  imageOverlayText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  imagePlaceholder: {
    width: 120,
    height: 160,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#A855F7",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF5FF",
  },
  imagePlaceholderIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "#DDD6FE",
    backgroundColor: "#FEFBFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#374151",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  saveButton: {
    flex: 2,
    backgroundColor: "#7C3AED",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#6B21A8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  bookItem: {
    backgroundColor: "#FAF5FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E9D5FF",
  },
  bookContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  coverImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#E9D5FF",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#7C3AED",
    fontWeight: "600",
    marginBottom: 4,
  },
  bookGenre: {
    fontSize: 12,
    color: "#A855F7",
    fontWeight: "500",
    marginBottom: 4,
  },
  bookDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
    marginBottom: 4,
  },
  bookNotes: {
    fontSize: 11,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  bookActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#A855F7",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  // Camera Modal Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  cameraButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(124, 58, 237, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  cameraButtonText: {
    fontSize: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  captureButtonText: {
    fontSize: 32,
  },
});
