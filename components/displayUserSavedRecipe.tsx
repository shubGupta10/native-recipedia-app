import {
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchSavedRecipe } from "@/firebase/firebaseFunctions";
import { COLORS } from "@/assets/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from "@/store/useAuthStore";

interface SavedRecipe {
    recipeId: string;
    name: string;
}

const DisplayUserSavedRecipe = () => {
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthStore();
    const userId = user?.uid!;

    useEffect(() => {
        const loadSavedRecipes = async () => {
            setLoading(true);
            try {
                const recipes = await fetchSavedRecipe(userId);
                setSavedRecipes(recipes as unknown as SavedRecipe[]);
            } catch (err) {
                setError("Failed to load your saved recipes. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadSavedRecipes();
    }, [userId]);


    if (loading) {
        return (
            <View className="flex-1 justify-center items-center ">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="mt-4 text-base text-[#a58e7c]">Loading your saved recipes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-[#ede1d1] p-5">
                <Ionicons name="alert-circle-outline" size={64} color={COLORS.primary} />
                <Text className="mt-4 text-base text-[#a58e7c] text-center mb-5">{error}</Text>
                <TouchableOpacity
                    className="bg-[#e17055] px-5 py-3 rounded-full"
                    onPress={() => setSavedRecipes([])}
                >
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4">
            <Text className="text-2xl font-bold text-[#50372a] mb-4">Your Saved Recipes</Text>
            {savedRecipes.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Ionicons name="bookmark-outline" size={40} color={COLORS.primary} />
                    <Text className="mt-4 text-base text-[#a58e7c] text-center">
                        You haven't saved any recipes yet.
                    </Text>
                </View>
            ) : (
                <View>
                    {savedRecipes.map((item) => (
                        <TouchableOpacity
                            onPress={() => router.push({
                                pathname: "/(screen)/displaySavedRecipe/[recipeId]",
                                params: {recipeId: item.recipeId}
                            })}
                            key={item.recipeId}
                            className="p-4 rounded-xl mb-1"
                        >
                            <Text className="text-lg font-semibold text-[#50372a]">
                                {item.name}
                            </Text>
                            <Text className="text-sm text-[#a58e7c]">
                                ID: {item.recipeId}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default DisplayUserSavedRecipe;