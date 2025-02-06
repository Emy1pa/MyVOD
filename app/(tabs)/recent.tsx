import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import axios from "axios";

type Movie = {
  _id: string;
  title: string;
  duration: string;
  published_at: string;
  image?: {
    url: string;
  };
};

export const RecentMoviesSection = () => {
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentMovies = async () => {
      try {
        const response = await axios.get<Movie[]>(
          "http:/192.168.8.151:8800/api/movies"
        );

        const sortedMovies = response.data
          .sort(
            (a, b) =>
              new Date(b.published_at).getTime() -
              new Date(a.published_at).getTime()
          )
          .slice(0, 5);

        setRecentMovies(sortedMovies);
      } catch (err) {
        console.error("Error fetching recent movies:", err);
        setError("Failed to load recent movies");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMovies();
  }, []);

  const handleMoviePress = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <View className="px-4 py-6">
        <ActivityIndicator size="small" color="#dc2626" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="px-4 py-6">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <View className="mt-8 px-4 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <MaterialIcons
            name="new-releases"
            size={24}
            color="#dc2626"
            className="mr-2"
          />
          <Text className="text-white text-xl font-bold">New Releases</Text>
        </View>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-red-500 mr-1">See All</Text>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#dc2626" />
        </TouchableOpacity>
      </View>

      {recentMovies.map((movie) => (
        <TouchableOpacity
          key={movie._id}
          className="bg-gray-800/40 rounded-xl p-4 mb-3 flex-row items-center"
          onPress={() => handleMoviePress(movie._id)}
        >
          <Image
            source={{
              uri:
                movie.image?.url ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
            className="w-20 h-20 rounded-lg mr-4"
          />
          <View className="flex-1">
            <Text className="text-white font-bold text-lg mb-1">
              {movie.title}
            </Text>
            <View className="flex-row items-center">
              <MaterialIcons
                name="schedule"
                size={16}
                color="#dc2626"
                className="mr-1"
              />
              <Text className="text-gray-400 mr-4">{movie.duration} min</Text>
              <Text className="text-gray-500">
                {new Date(movie.published_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>
          </View>
          <MaterialIcons name="play-circle-filled" size={40} color="#dc2626" />
        </TouchableOpacity>
      ))}
    </View>
  );
};
