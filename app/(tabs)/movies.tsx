import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { router } from "expo-router";

type Movie = {
  _id: string;
  title: string;
  duration: string;
  genre: string;
  image?: {
    url: string;
  };
};

export default function MoviesScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<Movie[]>(
          "http://192.168.1.3:8800/api/movies"
        );
        setMovies(response.data);
        setFilteredMovies(response.data);

        const uniqueGenres = [
          ...new Set(response.data.map((movie) => movie.genre)),
        ] as string[];
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const filtered = movies.filter((movie) => {
      const titleMatch = movie.title
        .toLowerCase()
        .includes(titleFilter.toLowerCase());
      const genreMatch = genreFilter === "" || movie.genre === genreFilter;
      return titleMatch && genreMatch;
    });
    setFilteredMovies(filtered);
  }, [titleFilter, genreFilter, movies]);
  const handleViewDetails = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        <View className="px-4 py-6">
          <Text className="text-white text-3xl font-bold mb-6">Movies</Text>

          <View className="space-y-4 mb-6">
            <View>
              <Text className="text-gray-400 mb-2">Search by title:</Text>
              <TextInput
                value={titleFilter}
                onChangeText={setTitleFilter}
                placeholder="Enter movie title..."
                placeholderTextColor="#666"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg"
              />
            </View>

            <View>
              <Text className="text-gray-400 mb-2">Filter by genre:</Text>
              <View className="bg-gray-800 rounded-lg">
                <Picker
                  selectedValue={genreFilter}
                  onValueChange={(value: string) => setGenreFilter(value)}
                  style={{ color: "white" }}
                >
                  <Picker.Item label="All Genres" value="" />
                  {genres.map((genre) => (
                    <Picker.Item key={genre} label={genre} value={genre} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {filteredMovies.map((movie) => (
              <Link
                key={movie._id}
                href={{
                  pathname: "/(tabs)/movie/[id]",
                  params: { id: movie._id },
                }}
                asChild
              >
                <TouchableOpacity className="w-[48%] mb-4">
                  <View className="bg-gray-800 rounded-xl overflow-hidden">
                    <Image
                      source={{
                        uri:
                          movie.image?.url ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                      }}
                      className="w-full h-48"
                    />
                    <View className="p-3">
                      <Text className="text-white font-bold text-lg mb-2">
                        {movie.title}
                      </Text>
                      <View className="flex-row items-center mb-2">
                        <MaterialIcons
                          name="access-time"
                          size={16}
                          color="#666"
                        />
                        <Text className="text-gray-400 ml-1">
                          {movie.duration} min
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <MaterialIcons name="movie" size={16} color="#666" />
                        <Text className="text-gray-400 ml-1">
                          {movie.genre}
                        </Text>
                      </View>
                      <TouchableOpacity
                        className="bg-orange-600 py-2 rounded-lg"
                        onPress={() => handleViewDetails(movie._id)}
                      >
                        <Text className="text-white text-center font-semibold">
                          View Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
