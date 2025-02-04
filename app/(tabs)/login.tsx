import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const imgBackground = require("../../assets/images/cinema1.jpeg");
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;
interface ProfileScreenProps {
  setIsLoggedIn?: (value: boolean) => void;
}
export default function ProfileScreen({ setIsLoggedIn }: ProfileScreenProps) {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const email = await AsyncStorage.getItem("userEmail");
      if (token) {
        setIsAuthenticated(true);
        setUserEmail(email);
        if (setIsLoggedIn) {
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };
  const storeAuthData = async (token: string, userId: string, role: string) => {
    try {
      await AsyncStorage.multiSet([
        ["authToken", token],
        ["userId", userId],
        ["userRole", role],
      ]);
    } catch (error) {
      console.error("Error storing auth data:", error);
      Toast.show({
        type: "error",
        text1: "Error saving authentication data",
      });
    }
  };
  const handleLogout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.multiRemove([
        "authToken",
        "userId",
        "userRole",
        "userEmail",
      ]);
      setIsAuthenticated(false);
      setUserEmail(null);
      if (setIsLoggedIn) {
        setIsLoggedIn(false);
      }
      Toast.show({
        type: "success",
        text1: "Successfully logged out",
      });
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      Toast.show({
        type: "error",
        text1: "Error logging out",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log("test");

      console.log(data);
      const response = await axios.post(
        "http://192.168.1.3:8800/api/auth/login",
        data
      );

      if (response.status === 200) {
        const { token, role, userId, accountStatus } = response.data;
        if (!token || !role || !userId) {
          throw new Error("Missing authentication data from response");
        }
        if (accountStatus === "banned") {
          Toast.show({
            type: "error",
            text1: "Your account has been banned. Please contact support.",
          });
          return;
        }
        await storeAuthData(token, userId, role);
        setIsAuthenticated(true);
        setUserEmail(data.email);

        if (setIsLoggedIn) {
          setIsLoggedIn(true);
        }
        Toast.show({
          type: "success",
          text1: "Login successful!",
        });
        setTimeout(() => {
          switch (role) {
            case "admin":
              router.push("/");
              break;
            case "client":
            default:
              router.push("/movies");
              break;
          }
        }, 1500);
      } else {
        Toast.show({
          type: "error",
          text1: "Unexpected response from server",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Toast.show({
        type: "error",
        text1: "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };
  if (isAuthenticated) {
    return (
      <ImageBackground source={imgBackground} className="flex-1">
        <SafeAreaView className="flex-1 bg-black/40">
          <View className="flex-1 justify-center px-6">
            <View className="mb-8">
              <Text className="text-2xl text-center font-bold text-white mb-2">
                Welcome back!
              </Text>
              {userEmail && (
                <Text className="text-lg text-center text-gray-200">
                  {userEmail}
                </Text>
              )}
            </View>

            <TouchableOpacity
              className="bg-red-600 py-3 rounded-lg mt-6"
              onPress={handleLogout}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? "Logging out..." : "Logout"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
  return (
    <ImageBackground source={imgBackground} className="flex-1">
      <SafeAreaView className="flex-1 bg-black/40">
        <KeyboardAvoidingView
          keyboardVerticalOffset={100}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-center px-6">
            <View className="mb-8">
              <Text className="text-3xl text-center font-bold text-white">
                Sign in to your account
              </Text>
            </View>

            <View className="space-y-4">
              <TextInput
                onChangeText={(text) => setValue("email", text)}
                placeholder="Email address"
                placeholderTextColor="#a1a1aa"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
              />
              {errors.email && (
                <Text className="text-red-500">{errors.email.message}</Text>
              )}
              <TextInput
                onChangeText={(text) => setValue("password", text)}
                placeholder="Password"
                placeholderTextColor="#a1a1aa"
                secureTextEntry
                className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
              <TouchableOpacity
                className="bg-orange-600 py-3 rounded-lg mt-6"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {isSubmitting ? "Signning in..." : "Sign in"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-6">
              <Text className="text-center text-gray-200">
                Don't have an account?{" "}
                <Text
                  className="text-orange-500 font-medium"
                  onPress={() => router.push("/(auth)/register")}
                >
                  Register here
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
