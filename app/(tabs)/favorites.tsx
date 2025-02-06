import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

interface MovieImage {
  url: string;
}

interface Movie {
  _id: string;
  title: string;
  genre: string;
  published_at: string;
  image?: MovieImage;
}

interface Favorite {
  _id: string;
  movie?: Movie;
  isCached?: boolean;
}

const FavoritesList = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    fetchFavorites();
  }, []);
  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("userId");
      const cachedFavoritesString = await AsyncStorage.getItem(
        "cachedFavorites"
      );
      const cachedFavorites: Record<string, boolean> = cachedFavoritesString
        ? JSON.parse(cachedFavoritesString)
        : {};

      if (!token || !userId) {
        setError("You must be logged in to view favorites.");
        setLoading(false);
        return;
      }

      const response = await axios.get<Favorite[]>(
        `http://192.168.8.151:8800/api/favorites/user/${userId}`,
        {
          headers: { token: token },
        }
      );

      const serverFavorites = Array.isArray(response.data) ? response.data : [];

      const mergedFavorites = serverFavorites.map((fav: Favorite) => ({
        ...fav,
        isCached: cachedFavorites[fav.movie?._id ?? ""] !== undefined,
      }));

      setFavorites(mergedFavorites);
      setLoading(false);
    } catch (err) {
      const error = err as Error | AxiosError;
      console.error("Error fetching favorites:", error);
      setError(error.message || "An error occurred while fetching favorites");
      setLoading(false);
    }
  };

  const handleMoviePress = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-black p-4">
        <Text className="text-white text-lg text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="p-3 bg-red-600 rounded-lg"
        >
          <Text className="text-white text-lg font-medium">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1" bounces={false}>
        <View className="p-4">
          <Text className="text-white text-2xl font-bold mb-4 mt-8">
            My Favorites
          </Text>

          {favorites.length === 0 ? (
            <Text className="text-gray-400 text-lg text-center ">
              You haven't added any favorites yet.
            </Text>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {favorites.map((favorite) => (
                <TouchableOpacity
                  key={favorite._id}
                  onPress={() =>
                    favorite.movie && handleMoviePress(favorite.movie._id)
                  }
                  className="w-[48%] mb-4 bg-gray-900 rounded-lg overflow-hidden"
                >
                  <Image
                    source={{
                      uri:
                        favorite.movie?.image?.url ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
                    }}
                    style={{
                      width: cardWidth,
                      height: cardWidth * 1.5,
                    }}
                    resizeMode="cover"
                  />
                  <View className="p-2">
                    <Text
                      className="text-white text-base font-medium mb-1"
                      numberOfLines={1}
                    >
                      {favorite.movie?.title}
                    </Text>
                    <Text className="text-gray-400 text-sm mb-1">
                      {favorite.movie?.genre}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {favorite.movie?.published_at &&
                        new Date(
                          favorite.movie.published_at
                        ).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push("/")}
        className="p-4 bg-red-600 m-4 rounded-lg"
      >
        <Text className="text-white text-center text-lg font-medium">
          Return to Dashboard
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FavoritesList;
