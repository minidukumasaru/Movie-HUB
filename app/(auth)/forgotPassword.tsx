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
  View
} from "react-native";

const { height } = Dimensions.get("window");

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handleResetPassword = async () => {
    if (isLoading) return;
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setEmailSent(true);
      Alert.alert(
        "Recovery Link Sent",
        "We've sent a password recovery link to your email. Check your inbox to regain access to MovieHub.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send recovery link. Please try again or contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setEmailSent(false);
    setEmail("");
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
        >
          <View style={{ flex: 1, backgroundColor: "#111" }}>
            {/* Header with Background */}
            <View
  style={{
    height: height * 0.4,
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

    {/* Logo & Tagline */}
    <View style={{ alignItems: "center", zIndex: 2 }}>
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

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
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

      <Text
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
        }}
      >
        {emailSent
          ? "Check your inbox to continue your movie journey."
          : "We'll help you recover your account."}
      </Text>
    </View>
  </ImageBackground>
</View>


            {/* Form Section */}
            <View
              style={{
                flex: 1,
                marginTop: -30,
                backgroundColor: "#111",
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingHorizontal: 24,
                paddingTop: 32,
              }}
            >
              {!emailSent ? (
                <>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#fff",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Recover Your Account
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#9ca3af",
                      marginBottom: 32,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    Enter your email to get a recovery link and continue enjoying
                    MovieHub.
                  </Text>

                  {/* Email Input */}
                  <View style={{ marginBottom: 24 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#f59e0b",
                        marginBottom: 8,
                        marginLeft: 4,
                      }}
                    >
                      Email Address
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#1f1f1f",
                        borderWidth: 1,
                        borderColor: emailError ? "#ef4444" : "#333",
                        borderRadius: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 14,
                      }}
                    >
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={emailError ? "#ef4444" : "#f59e0b"}
                      />
                      <TextInput
                        style={{
                          flex: 1,
                          marginLeft: 12,
                          fontSize: 16,
                          color: "white",
                        }}
                        placeholder="Enter your email"
                        placeholderTextColor="#6b7280"
                        value={email}
                        onChangeText={handleEmailChange}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                    {emailError ? (
                      <Text
                        style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}
                      >
                        {emailError}
                      </Text>
                    ) : null}
                  </View>

                  {/* Reset Button */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: isLoading ? "#555" : "#f59e0b",
                      paddingVertical: 16,
                      borderRadius: 12,
                    }}
                    onPress={handleResetPassword}
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
                      {isLoading ? "Sending..." : "Send Recovery Link"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={{ alignItems: "center", marginBottom: 24 }}>
                    <Ionicons name="mail" size={50} color="#f59e0b" />
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "white",
                        marginTop: 12,
                        textAlign: "center",
                      }}
                    >
                      Recovery Link Sent
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#9ca3af",
                        textAlign: "center",
                        lineHeight: 20,
                      }}
                    >
                      We've sent a recovery link to{" "}
                      <Text style={{ fontWeight: "600", color: "#f59e0b" }}>
                        {email}
                      </Text>
                    </Text>
                  </View>

                  {/* Next Steps */}
                  <View
                    style={{
                      backgroundColor: "#1f1f1f",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 24,
                      borderWidth: 1,
                      borderColor: "#333",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#f59e0b",
                        marginBottom: 8,
                      }}
                    >
                      🎬 Next Steps
                    </Text>
                    <Text
                      style={{ fontSize: 13, color: "#d1d5db", lineHeight: 18 }}
                    >
                      1. Check your email inbox{"\n"}
                      2. Click the recovery link{"\n"}
                      3. Create a new password{"\n"}
                      4. Return to MovieHub and continue reviewing
                    </Text>
                  </View>

                  {/* Resend */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#1f1f1f",
                      borderWidth: 1,
                      borderColor: "#333",
                      paddingVertical: 14,
                      borderRadius: 12,
                      marginBottom: 20,
                    }}
                    onPress={handleResendEmail}
                  >
                    <Text
                      style={{
                        color: "#f59e0b",
                        textAlign: "center",
                        fontSize: 14,
                        fontWeight: "500",
                      }}
                    >
                      Didn't receive the email? Send again
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Back to Login */}
              <View style={{ alignItems: "center", marginBottom: 10 }}>
                <Pressable
                  onPress={() => router.back()}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 15,
                  }}
                >
                  <Ionicons
                    name="arrow-back-outline"
                    size={16}
                    color="#f59e0b"
                  />
                  <Text
                    style={{
                      marginLeft: 6,
                      color: "#f59e0b",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    Back to Login
                  </Text>
                </Pressable>
              </View>

              {/* Footer */}
              <View
                style={{
                  alignItems: "center",
                  paddingBottom: 20,
                  marginTop: 20,
                  paddingTop: 20,
                }}
              >
                <Text
                  style={{
                    color: "#9ca3af",
                    fontSize: 12,
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  Still can't access your MovieHub account?
                </Text>
                <Pressable>
                  <Text
                    style={{
                      color: "#f59e0b",
                      fontSize: 12,
                      fontWeight: "600",
                      textDecorationLine: "underline",
                    }}
                  >
                    Contact MovieHub Support
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
