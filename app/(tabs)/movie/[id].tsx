import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const screenWidth = Dimensions.get("window").width;
const imageHeight = (screenWidth * 3) / 2;

type MovieDetails = {
  _id: string;
  title: string;
  duration: string;
  genre: string;
  description: string;
  published_at: string;
  image?: {
    url: string;
  };
};

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get<MovieDetails>(
          `http://192.168.1.3:8800/api/movies/${id}`
        );
        setMovie(response.data);

        const relatedResponse = await axios.get<MovieDetails[]>(
          `http://192.168.1.3:8800/api/movies`
        );

        const filtered = relatedResponse.data
          .filter((m) => m._id !== id && m.genre === response.data.genre)
          .slice(0, 3);

        setRelatedMovies(filtered);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleRelatedMoviePress = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">{error || "Movie not found"}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" bounces={false}>
        <View>
          <Image
            source={{
              uri:
                movie.image?.url ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
            style={{ width: screenWidth, height: imageHeight }}
            resizeMode="cover"
          />
        </View>

        <View className="p-4">
          <View className="mb-6">
            <Text className="text-white text-3xl font-bold">{movie.title}</Text>
          </View>

          <View className="flex-row space-x-6 mb-6 bg-gray-900 p-4 rounded-lg">
            <View className="flex-row items-center">
              <MaterialIcons name="access-time" size={24} color="#dc2626" />
              <Text className="text-white ml-2 text-base">
                {movie.duration} min
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="movie" size={24} color="#dc2626" />
              <Text className="text-white ml-2 text-base">{movie.genre}</Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-400 text-lg font-semibold mb-2">
              Description
            </Text>
            <Text className="text-gray-300 leading-6 text-base">
              {movie.description}
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-gray-400 text-lg font-semibold mb-2">
              Release Date
            </Text>
            <Text className="text-gray-300 text-base">
              {new Date(movie.published_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {relatedMovies.length > 0 && (
            <View className="mb-6">
              <Text className="text-gray-400 text-lg font-semibold mb-4">
                Related Movies
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="space-x-4"
              >
                {relatedMovies.map((relatedMovie) => (
                  <TouchableOpacity
                    key={relatedMovie._id}
                    onPress={() => handleRelatedMoviePress(relatedMovie._id)}
                    className="w-32"
                  >
                    <Image
                      source={{
                        uri:
                          relatedMovie.image?.url ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                      }}
                      className="w-32 h-48 rounded-lg mb-2"
                    />
                    <Text
                      className="text-white text-sm font-medium"
                      numberOfLines={2}
                    >
                      {relatedMovie.title}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {relatedMovie.duration} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
