import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RecentMoviesSection } from "./recent";
const imgBackground = require("../../assets/images/cinema1.jpeg");
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        <View className="h-96 relative">
          <Image source={imgBackground} className="w-full h-full absolute" />
          <View className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black" />
          <View className="absolute bottom-8 left-4 right-4">
            <Text className="text-white text-5xl font-bold mb-2">
              Discover Movies
            </Text>
            <Text className="text-gray-300 text-lg mb-6 leading-relaxed">
              Explore the latest blockbusters and timeless classics in our
              curated collection
            </Text>
            <TouchableOpacity className="bg-red-600 rounded-xl py-4 px-6 flex-row items-center justify-center w-48 shadow-lg shadow-red-600/50">
              <MaterialIcons
                name="play-arrow"
                size={24}
                color="#fff"
                className="mr-2"
              />

              <Text className="text-white font-bold text-lg">Watch Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <RecentMoviesSection />
      </ScrollView>
    </SafeAreaView>
  );
}
