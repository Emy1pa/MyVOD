import { router } from "expo-router";
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
} from "react-native";
const imgBackground = require("../../assets/images/cinema1.jpeg");

export default function ProfileScreen({}) {
  return (
    <ImageBackground source={imgBackground} className="flex-1">
      <SafeAreaView className="flex-1 bg-black/40">
        <KeyboardAvoidingView
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
                placeholder="Email address"
                placeholderTextColor="#a1a1aa"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
              />

              <TextInput
                placeholder="Password"
                placeholderTextColor="#a1a1aa"
                secureTextEntry
                className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
              />

              <TouchableOpacity
                className="bg-orange-600 py-3 rounded-lg mt-6"
                onPress={() => {
                  console.log("Login pressed");
                }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Sign in
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
