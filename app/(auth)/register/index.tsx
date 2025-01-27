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

const imgBackground = require("../../../assets/images/cinema1.jpeg");

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground source={imgBackground} className="flex-1">
        <SafeAreaView className="flex-1 bg-black/40">
          <KeyboardAvoidingView
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
                    placeholder="First Name"
                    placeholderTextColor="#a1a1aa"
                    autoCapitalize="words"
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
                  />

                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="#a1a1aa"
                    autoCapitalize="words"
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
                  />

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

                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor="#a1a1aa"
                    keyboardType="phone-pad"
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
                  />

                  <TextInput
                    placeholder="Address"
                    placeholderTextColor="#a1a1aa"
                    multiline
                    numberOfLines={3}
                    className="w-full bg-white/90 rounded-lg px-4 py-3 text-gray-900"
                  />

                  <TouchableOpacity
                    className="bg-orange-600 py-3 rounded-lg mt-6"
                    onPress={() => {
                      router.push("/(tabs)");
                    }}
                  >
                    <Text className="text-white text-center font-semibold text-lg">
                      Register
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
