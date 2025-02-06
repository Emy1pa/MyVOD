import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
  movieId: string;
};

interface Rating {
  _id: string;
  movie: string;
  user: string;
  ratingValue: number;
}

const MovieRating = ({ movieId }: Props) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (movieId) {
      fetchRatings();
    }
  }, [movieId]);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const currentUserId = await AsyncStorage.getItem("userId");
    setIsLoggedIn(!!token);
    setUserId(currentUserId);
  };

  const fetchRatings = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch("http://192.168.8.151:8800/api/rates", {
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
      });
      const result = await response.json();

      if (!Array.isArray(result)) return;

      const movieRatings = result.filter((rate) => rate.movie === movieId);

      if (movieRatings.length > 0) {
        const total = movieRatings.reduce(
          (sum: number, rate: Rating) => sum + rate.ratingValue,
          0
        );
        setAverageRating(total / movieRatings.length);
        setTotalRating(movieRatings.length);

        if (userId) {
          const currentUserRating = movieRatings.find(
            (rate) => rate.user === userId
          );
          setUserRating(
            currentUserRating ? currentUserRating.ratingValue : null
          );
        }
      } else {
        setAverageRating(0);
        setTotalRating(0);
        setUserRating(null);
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };
  const deleteRating = async () => {
    if (!isLoggedIn || !userId) return;

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        `http://192.168.8.151:8800/api/rates/${movieId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token || "",
          },
          body: JSON.stringify({
            user: userId,
            movie: movieId,
          }),
        }
      );

      if (response.ok) {
        setUserRating(null);
        await fetchRatings();
      }
    } catch (err) {
      console.error("Error deleting rating:", err);
    }
  };

  const handleRating = async (value: number) => {
    if (!isLoggedIn || !userId) return;

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch("http://192.168.8.151:8800/api/rates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify({
          user: userId,
          movie: movieId,
          ratingValue: value,
        }),
      });

      if (response.ok) {
        setUserRating(value);
        await fetchRatings();
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => handleRating(value)}
              disabled={!isLoggedIn}
              style={{ padding: 4 }}
            >
              <FontAwesome
                name={userRating && userRating >= value ? "star" : "star-o"}
                size={24}
                color={userRating && userRating >= value ? "#FFB800" : "#666"}
              />
            </TouchableOpacity>
          ))}
        </View>
        {averageRating > 0 && (
          <Text style={{ color: "#9ca3af", fontSize: 14 }}>
            ({averageRating.toFixed(1)} • {totalRatings})
          </Text>
        )}
      </View>
      {!isLoggedIn && (
        <Text
          style={{
            color: "#9ca3af",
            fontSize: 14,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Please log in to rate
        </Text>
      )}
    </View>
  );
};

export default MovieRating;
