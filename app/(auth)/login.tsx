import { login } from "@/service/authService";
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

const { height } = Dimensions.get("window");

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError("");
  };

  const handleLogin = async () => {
    if (isLoading) return;

    setEmailError("");
    setPasswordError("");
    let hasErrors = false;

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
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);
    await login(email, password)
      .then(() => {
        router.push("/home");
      })
      .catch(() => {
        Alert.alert(
          "Login Failed",
          "Invalid credentials. Please check your email and password and try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
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
          <View style={{ flex: 1, backgroundColor: "#111" }}>
            {/* Header Section with Background Image */}
            {/* Header Section with Background Image */}
<View
  style={{
    height: height * 0.34,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  }}
>
  <ImageBackground
    source={require("../../assets/images/screen-0.jpg")}
    resizeMode="cover"
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {/* Dark overlay for readability */}
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
    />

    {/* Back button */}
    <TouchableOpacity
      onPress={() => router.back()}
      style={{
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
      }}
    >
      <Ionicons name="arrow-back" size={20} color="#fff" />
    </TouchableOpacity>

    {/* Logo circle */}
    <View
      style={{
        width: 76,
        height: 76,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.06)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <Ionicons name="film-outline" size={36} color="#fff" />
    </View>

    {/* MovieHub Logo */}
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 36,
          fontWeight: "900",
          color: "#fff",
          letterSpacing: -0.5,
        }}
      >
        Movie
      </Text>
      <View
        style={{
          backgroundColor: "#f59e0b",
          borderRadius: 6,
          paddingHorizontal: 8,
          marginLeft: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 34,
            fontWeight: "900",
            color: "#000",
            letterSpacing: -0.5,
          }}
        >
          Hub
        </Text>
      </View>
    </View>

    {/* Tagline */}
    <Text
      style={{
        fontSize: 13,
        color: "rgba(255,255,255,0.9)",
        marginTop: 8,
        textAlign: "center",
      }}
    >
      Discover. Review. Share your favorites.
    </Text>
  </ImageBackground>
</View>


            {/* Login Card */}
            <View
              style={{
                flex: 1,
                marginTop: -30,
                backgroundColor: "#1a1a1a",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingHorizontal: 24,
                paddingTop: 32,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#f59e0b",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Welcome Back, Critic
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#9ca3af",
                  marginBottom: 32,
                  textAlign: "center",
                }}
              >
                Continue sharing your movie reviews
              </Text>

              {/* Email Input */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
                  Email Address
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#222",
                    borderWidth: 1,
                    borderColor: emailError ? "#ef4444" : "#333",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={emailError ? "#ef4444" : "#f59e0b"}
                  />
                  <TextInput
                    style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#fff" }}
                    placeholder="Enter your email"
                    placeholderTextColor="#6b7280"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {emailError ? (
                  <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={{ marginBottom: 24 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
                    Password
                  </Text>
                  <Pressable onPress={() => router.push("/forgotPassword")}>
                    <Text style={{ color: "#f59e0b", fontSize: 12, fontWeight: "600" }}>
                      Forgot Password?
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#222",
                    borderWidth: 1,
                    borderColor: passwordError ? "#ef4444" : "#333",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={passwordError ? "#ef4444" : "#f59e0b"}
                  />
                  <TextInput
                    style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#fff" }}
                    placeholder="Enter your password"
                    placeholderTextColor="#6b7280"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#f59e0b"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: isLoading ? "#555" : "#f59e0b",
                  paddingVertical: 16,
                  borderRadius: 12,
                }}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text
                  style={{
                    color: "#000",
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {isLoading ? "Logging In..." : "Enter MovieHub"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 24,
                }}
              >
                <View style={{ flex: 1, height: 1, backgroundColor: "#333" }} />
                <Text style={{ marginHorizontal: 16, color: "#6b7280" }}>or</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: "#333" }} />
              </View>

              {/* Quick Access */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 12,
                  backgroundColor: "#222",
                  marginBottom: 32,
                }}
              >
                <Ionicons name="play-circle-outline" size={20} color="#f59e0b" />
                <Text style={{ marginLeft: 8, fontWeight: "500", color: "#fff" }}>
                  Quick Movie Access
                </Text>
              </TouchableOpacity>

              {/* Register */}
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text style={{ color: "#9ca3af", fontSize: 14 }}>
                  New to MovieHub?{" "}
                  <Pressable onPress={() => router.push("/register")}>
                    <Text
                      style={{
                        fontWeight: "600",
                        color: "#f59e0b",
                        textDecorationLine: "underline",
                      }}
                    >
                      Join Now
                    </Text>
                  </Pressable>
                </Text>
              </View>

              {/* Security */}
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Ionicons name="shield-checkmark" size={14} color="#f59e0b" />
                <Text style={{ marginLeft: 6, color: "#9ca3af", fontSize: 11 }}>
                  Your movie data is private and secure
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
