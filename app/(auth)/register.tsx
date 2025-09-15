// Register.tsx
import { register } from "@/service/authService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Register = () => {
  const router = useRouter();

  // --- state variables (kept unchanged) ---
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  // Error states (kept same)
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  // --- validation helpers (unchanged logic) ---
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const clearError = (field: string) => {
    switch (field) {
      case "firstName":
        setFirstNameError("");
        break;
      case "lastName":
        setLastNameError("");
        break;
      case "email":
        setEmailError("");
        break;
      case "password":
        setPasswordError("");
        break;
      case "confirmPassword":
        setConfirmPasswordError("");
        break;
    }
  };

  // --- main register handler (logic preserved exactly) ---
  const handleRegister = async () => {
    if (isLoading) return;

    // Reset all errors
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasErrors = false;

    // Validation
    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      hasErrors = true;
    } else if (firstName.trim().length < 2) {
      setFirstNameError("First name must be at least 2 characters");
      hasErrors = true;
    }

    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      hasErrors = true;
    } else if (lastName.trim().length < 2) {
      setLastNameError("Last name must be at least 2 characters");
      hasErrors = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasErrors = true;
    } else if (!validatePassword(password)) {
      setPasswordError(
        "Password must be 8+ characters with uppercase, lowercase, and number"
      );
      hasErrors = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasErrors = true;
    }

    if (!acceptTerms) {
      Alert.alert(
        "Terms Required",
        "Please accept the Terms of Service and Privacy Policy to continue."
      );
      return;
    }

    if (hasErrors) return;

    setIsLoading(true);

    try {
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: password,
      };

      await register(userData.email, userData.password);

      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully. You can now sign in.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Registration Failed",
        "An account with this email may already exist, or there was a server error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- render UI (movie review / MovieHub theme) ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.pageContainer}>
            {/* Header: Movie background image + logo text (MovieHub) */}
            <View style={styles.headerSection}>
              <ImageBackground
                source={require("../../assets/images/screen-0.jpg")}
                resizeMode="cover"
                style={styles.headerBg}
              >
                {/* dark overlay for readability */}
                <View style={styles.headerOverlay} />

                {/* back button at top-left */}
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backBtn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>

                {/* Logo & tagline */}
                <View style={styles.headerContent}>
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
                </View>
              </ImageBackground>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Create Your Movie Critic Profile</Text>
              <Text style={styles.formSubtitle}>Share reviews, rate movies & build your watchlist</Text>

              {/* --- Name row (kept structure & logic) --- */}
              <View style={styles.row}>
                {/* First name */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>First Name</Text>
                  <View style={[styles.inputBox, firstNameError ? styles.inputError : null]}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={firstNameError ? "#EF4444" : "#f59e0b"}
                    />
                    <TextInput
                      style={styles.textInput}
                      placeholder="First name"
                      placeholderTextColor="#9ca3af"
                      value={firstName}
                      onChangeText={(text) => {
                        setFirstName(text);
                        clearError("firstName");
                      }}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
                </View>

                {/* Last name */}
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.label}>Last Name</Text>
                  <View style={[styles.inputBox, lastNameError ? styles.inputError : null]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Last name"
                      placeholderTextColor="#9ca3af"
                      value={lastName}
                      onChangeText={(text) => {
                        setLastName(text);
                        clearError("lastName");
                      }}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
                </View>
              </View>

              {/* --- Email --- */}
              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputBoxFull, emailError ? styles.inputError : null]}>
                  <Ionicons name="mail-outline" size={20} color={emailError ? "#EF4444" : "#f59e0b"} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      clearError("email");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              {/* --- Password --- */}
              <View style={{ marginTop: 14 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.label}>Password</Text>
                  <Text style={styles.hintText}>Min 8 chars, upper + lower + number</Text>
                </View>

                <View style={[styles.inputBoxFull, passwordError ? styles.inputError : null]}>
                  <Ionicons name="lock-closed-outline" size={20} color={passwordError ? "#EF4444" : "#f59e0b"} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Create a secure password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      clearError("password");
                    }}
                    autoComplete="password-new"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#f59e0b" />
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              {/* --- Confirm Password --- */}
              <View style={{ marginTop: 14 }}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={[styles.inputBoxFull, confirmPasswordError ? styles.inputError : null]}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={confirmPasswordError ? "#EF4444" : "#f59e0b"}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Confirm your password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      clearError("confirmPassword");
                    }}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#f59e0b" />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              </View>

              {/* --- Terms --- */}
              <Pressable
                style={styles.termsRow}
                onPress={() => setAcceptTerms(!acceptTerms)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={[styles.checkbox, { borderColor: acceptTerms ? "#f59e0b" : "#4b5563", backgroundColor: acceptTerms ? "#f59e0b" : "transparent" }]}>
                  {acceptTerms && <Ionicons name="checkmark" size={12} color="#000" />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the{" "}
                  <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </Pressable>

              {/* --- Register Button --- */}
              <TouchableOpacity
                style={[styles.primaryButton, isLoading ? { opacity: 0.75 } : null]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? "Creating Your Profile..." : "Start Your Movie Journey"}
                </Text>
              </TouchableOpacity>

              {/* --- Divider Or Social Quick Access area (kept from original structure) --- */}
              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.line} />
              </View>

              <TouchableOpacity style={styles.quickAccessBtn} activeOpacity={0.85}>
                <Ionicons name="play-circle-outline" size={20} color="#f59e0b" />
                <Text style={styles.quickAccessText}>Quick Movie Access</Text>
              </TouchableOpacity>

              {/* --- Sign in link --- */}
              <View style={styles.signInRow}>
                <Text style={styles.smallText}>Already on MovieHub? </Text>
                <Pressable onPress={() => router.back()}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </Pressable>
              </View>

              {/* --- Security badge / footer --- */}
              <View style={styles.securityRow}>
                <Ionicons name="shield-checkmark" size={14} color="#f59e0b" />
                <Text style={styles.securityText}>Your movie reviews & data are private and secure</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- styles for MovieHub theme (dark cinema + orange accent) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#050505",
  },
  headerSection: {
    height: height * 0.34,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  headerBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 20,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.48)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerContent: {
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
    fontSize: 36,
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
    fontSize: 34,
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
  // form card
  formCard: {
    flex: 1,
    marginTop: -30,
    backgroundColor: "#0f0f10",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 42,
    elevation: 10,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 6,
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 14,
    color: "#f59e0b",
    marginBottom: 18,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e6e6e6",
    marginBottom: 6,
    marginLeft: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141416",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  inputBoxFull: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141416",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 52,
  },
  inputError: {
    backgroundColor: "#2b0b0b",
    borderColor: "#7f1d1d",
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#fff",
    paddingVertical: 0,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 11,
    marginTop: 6,
    marginLeft: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hintText: {
    fontSize: 11,
    color: "#9ca3af",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 18,
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4b5563",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 18,
  },
  linkText: {
    color: "#f59e0b",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 18,
    marginBottom: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#222",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9ca3af",
  },
  quickAccessBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 12,
    backgroundColor: "#141416",
    marginBottom: 20,
  },
  quickAccessText: {
    marginLeft: 8,
    color: "#ddd",
    fontWeight: "500",
  },
  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  smallText: {
    color: "#9ca3af",
  },
  signInLink: {
    color: "#f59e0b",
    fontWeight: "700",
    marginLeft: 6,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 6,
  },
  securityText: {
    marginLeft: 8,
    color: "#9ca3af",
    fontSize: 11,
  },
});

export default Register;
