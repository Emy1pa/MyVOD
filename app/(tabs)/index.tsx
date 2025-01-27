import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const imgBackground = require("../../assets/images/cinema1.jpeg");
export default function HomeScreen() {
  const featuredMovies = [
    {
      id: 1,
      title: "Inception",
      rating: "9.2",
      genre: "Sci-Fi",
      year: "2010",
      duration: "2h 28min",
      image: require("../../assets/images/inception.jpg"),
    },
    {
      id: 2,
      title: "The Dark Knight",
      rating: "9.0",
      genre: "Action",
      year: "2008",
      duration: "2h 32min",
      image: require("../../assets/images/darkNight.jpg"),
    },
    {
      id: 3,
      title: "Interstellar",
      rating: "8.9",
      genre: "Sci-Fi",
      year: "2014",
      duration: "2h 49min",
      image: require("../../assets/images/inter.jpg"),
    },
  ];
  type Category = {
    id: string;
    name: string;
    icon: keyof typeof MaterialIcons.glyphMap;
  };
  const categories: Category[] = [
    { id: "1", name: "Action", icon: "local-fire-department" },
    { id: "2", name: "Drama", icon: "theater-comedy" },
    { id: "3", name: "Sci-Fi", icon: "rocket" },
    { id: "4", name: "Comedy", icon: "sentiment-very-satisfied" },
    { id: "5", name: "Horror", icon: "whatshot" },
  ];

  const recentlyAdded = [
    { id: 4, title: "Dune", rating: "8.7", year: "2021" },
    { id: 5, title: "Oppenheimer", rating: "8.9", year: "2023" },
    { id: 6, title: "Avatar 2", rating: "8.3", year: "2022" },
  ];

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

        <View className="mt-6">
          <Text className="text-white text-xl font-bold mb-4 px-4">
            Browse Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="bg-gray-800/80 rounded-2xl px-6 py-3 mr-3 flex-row items-center"
              >
                <MaterialIcons
                  name={category.icon}
                  size={20}
                  color="#fff"
                  className="mr-2"
                />
                <Text className="text-white font-medium">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mt-8 px-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MaterialIcons
                name="trending-up"
                size={28}
                color="#dc2626"
                className="mr-2"
              />
              <Text className="text-white text-xl font-bold">Trending Now</Text>
            </View>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-red-500 mr-1">See All</Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={16}
                color="#dc2626"
              />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredMovies.map((movie) => (
              <TouchableOpacity key={movie.id} className="mr-4 w-36">
                <View className="relative">
                  <Image
                    source={movie.image}
                    className="w-36 h-52 rounded-xl mb-2"
                  />
                  <View className="absolute top-2 right-2 bg-black/60 rounded-lg px-2 py-1">
                    <Text className="text-white text-xs">{movie.duration}</Text>
                  </View>
                </View>
                <Text className="text-white font-bold text-base mb-1">
                  {movie.title}
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="star"
                      size={16}
                      color="#eab308"
                      className="mr-1"
                    />
                    <Text className="text-gray-400">{movie.rating}</Text>
                  </View>
                  <Text className="text-gray-500 text-sm">{movie.year}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mt-8 px-4 mb-8">
          <View className="flex-row items-center mb-4">
            <MaterialIcons
              name="update"
              size={24}
              color="#fff"
              className="mr-2"
            />
            <Text className="text-white text-xl font-bold">Recently Added</Text>
          </View>
          {recentlyAdded.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              className="bg-gray-800/40 rounded-xl p-4 mb-3 flex-row items-center"
            >
              <Image
                source={require("../../assets/images/cinema.jpg")}
                className="w-20 h-20 rounded-lg mr-4"
              />
              <View className="flex-1">
                <Text className="text-white font-bold text-lg mb-1">
                  {movie.title}
                </Text>
                <View className="flex-row items-center">
                  <MaterialIcons
                    name="star"
                    size={16}
                    color="#eab308"
                    className="mr-1"
                  />
                  <Text className="text-gray-400 mr-4">{movie.rating}</Text>
                  <Text className="text-gray-500">{movie.year}</Text>
                </View>
              </View>
              <MaterialIcons
                name="play-circle-filled"
                size={40}
                color="#dc2626"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
