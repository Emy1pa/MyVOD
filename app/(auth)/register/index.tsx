import { Stack } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Toast from "react-native-toast-message";

const imgBackground = require("../../../assets/images/cinema1.jpeg");
const schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});
type FormData = z.infer<typeof schema>;
export default function RegisterScreen() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: FormData) => {
    try {
      console.log(data);
      const response = await axios.post(
        "http://192.168.1.3:8800/api/auth/register",
        data
      );
      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Registration successful!",
        });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        Toast.show({
          type: "error",
          text1: "Unexpected response from server",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Toast.show({
        type: "error",
        text1: "Registration failed",
      });
    }
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Toast />
      <ImageBackground source={imgBackground} className="flex-1">
        <SafeAreaView className="flex-1 bg-black/40">
          <KeyboardAvoidingView
            keyboardVerticalOffset={100}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            >
              <View className="px-6">
                <View className="mb-8">
                  <Text className="text-3xl text-center font-bold text-white">
                    Create an Account
                  </Text>
                </View>

                <View className="space-y-4">
                  <TextInput
                    onChangeText={(text) => setValue("firstName", text)}
                    placeholder="First Name"
                    placeholderTextColor="#a1a1aa"
                    autoCapitalize="words"
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
                  />
                  {errors.firstName && (
                    <Text className="text-red-500">
                      {errors.firstName.message}
                    </Text>
                  )}

                  <TextInput
                    onChangeText={(text) => setValue("lastName", text)}
                    placeholder="Last Name"
                    placeholderTextColor="#a1a1aa"
                    autoCapitalize="words"
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
                  />
                  {errors.lastName && (
                    <Text className="text-red-500">
                      {errors.lastName.message}
                    </Text>
                  )}

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
                    <Text className="text-red-500">
                      {errors.password.message}
                    </Text>
                  )}

                  <TextInput
                    onChangeText={(text) => setValue("phoneNumber", text)}
                    placeholder="Phone Number"
                    placeholderTextColor="#a1a1aa"
                    keyboardType="phone-pad"
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
                  />
                  {errors.phoneNumber && (
                    <Text className="text-red-500">
                      {errors.phoneNumber.message}
                    </Text>
                  )}
                  <TextInput
                    onChangeText={(text) => setValue("address", text)}
                    placeholder="Address"
                    placeholderTextColor="#a1a1aa"
                    multiline
                    numberOfLines={3}
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
                  />
                  {errors.address && (
                    <Text className="text-red-500">
                      {errors.address.message}
                    </Text>
                  )}
                  <TouchableOpacity
                    className="bg-orange-600 py-3 rounded-lg mt-6"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    <Text className="text-white text-center font-semibold text-lg">
                      {isSubmitting ? "Registering..." : "Register"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="mt-6">
                  <Text className="text-center text-gray-200">
                    Already have an account?{" "}
                    <Text
                      className="text-orange-500 font-medium"
                      onPress={() => router.push("/(tabs)/login")}
                    >
                      Sign in here
                    </Text>
                  </Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
