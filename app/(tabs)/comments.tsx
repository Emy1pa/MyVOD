import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

type Comment = {
  _id: string;
  user: string;
  content: string;
  movie: string;
};

const MovieComments = ({ movieId }: { movieId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedToken = await AsyncStorage.getItem("authToken");

      setUserId(storedUserId);
      setToken(storedToken);
    };

    fetchUserData();
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://192.168.1.3:8800/api/comments`, {
        params: { movie: movieId },
        headers: token ? { token } : {},
      });
      setComments(response.data);
    } catch (err) {
      console.log("Error", "Failed to load comments");
    }
  };

  const handleSubmit = async () => {
    if (!token || !newComment.trim()) return;

    try {
      setLoading(true);
      await axios.post(
        `http://192.168.1.3:8800/api/comments`,
        {
          user: userId,
          movie: movieId,
          content: newComment.trim(),
        },
        {
          headers: { token },
        }
      );
      setNewComment("");
      await fetchComments();
    } catch (err) {
      Alert.alert("Error", "Failed to post comment");
      console.error("Error posting comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!token) return;

    Alert.alert("Confirm Delete", "Delete this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(
              `http://192.168.1.3:8800/api/comments/${commentId}`,
              {
                data: { user: userId },
                headers: { token },
              }
            );
            setComments(
              comments.filter((comment) => comment._id !== commentId)
            );
          } catch (err) {
            Alert.alert("Error", "Failed to delete comment");
          }
        },
      },
    ]);
  };

  const handleEdit = async (commentId: string) => {
    if (!token) return;

    if (editingId === commentId) {
      if (editContent.trim().length < 5) {
        Alert.alert("Error", "Comment too short");
        return;
      }
      try {
        await axios.put(
          `http://192.168.1.3:8800/api/comments/${commentId}`,
          { content: editContent.trim() },
          { headers: { token } }
        );
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? { ...comment, content: editContent.trim() }
              : comment
          )
        );
        setEditingId(null);
        setEditContent("");
      } catch (err) {
        Alert.alert("Error", "Failed to update comment");
      }
    } else {
      const comment = comments.find((c) => c._id === commentId);
      if (comment) {
        setEditContent(comment.content);
        setEditingId(commentId);
      }
    }
  };

  const renderComment = ({ item }: { item: Comment }) => {
    const isOwnComment = item.user === userId;

    return (
      <View className="bg-white p-3 mb-2 rounded-lg">
        {editingId === item._id ? (
          <>
            <TextInput
              value={editContent}
              onChangeText={setEditContent}
              multiline
              className="border border-gray-300 p-2 mb-2 rounded"
              maxLength={100}
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => handleEdit(item._id)}
                disabled={editContent.trim().length < 5}
                className="mr-2"
              >
                <Text className="text-green-600">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditingId(null)}>
                <Text className="text-red-600">Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text className="text-base">{item.content}</Text>
            {isOwnComment && (
              <View className="flex-row justify-end mt-2 space-x-3">
                <TouchableOpacity onPress={() => handleEdit(item._id)}>
                  <MaterialIcons name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  if (!token) {
    return (
      <View className="p-4 items-center">
        <Text className="text-gray-500">Please log in to view comments</Text>
      </View>
    );
  }

  return (
    <View className="p-4 bg-gray-100">
      <Text className="text-xl font-bold mb-4">
        Comments ({comments.length})
      </Text>

      {
        <View className="mb-4">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write a comment..."
            multiline
            className="border border-gray-300 p-2 mb-2 rounded"
            maxLength={100}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || newComment.trim().length < 5}
            className={`p-2 rounded ${
              loading || newComment.trim().length < 5
                ? "bg-gray-400"
                : "bg-blue-500"
            }`}
          >
            <Text className="text-white text-center">
              {loading ? "Posting..." : "Post Comment"}
            </Text>
          </TouchableOpacity>
        </View>
      }

      {comments.length === 0 ? (
        <Text className="text-center text-gray-500 mt-4">No comments yet</Text>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

export default MovieComments;
