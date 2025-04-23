import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
    ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { getRecipeById } from "@/firebase/firebaseFunctions";
import { useAuthStore } from "@/store/useAuthStore";
import { COLORS } from "@/assets/colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';

interface Recipe {
    name: string;
    cookTime: string;
    prepTime: string;
    ingredients: string[];
    instructions: string[];
    servingSuggestion: string;
    createdAt: string;
    recipeId: string;
}

const DisplaySavedRecipe = () => {
    const { recipeId } = useLocalSearchParams();
    const { user } = useAuthStore();
    const userId = user?.uid!;
    const router = useRouter();

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchById = async () => {
            setLoading(true);
            try {
                const res = await getRecipeById(userId, recipeId as string);
                setRecipe(res as Recipe);
            } catch (err) {
                console.error("Error fetching recipe:", err);
                setError("Failed to load recipe. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchById();
    }, [recipeId, userId]);

    // Format the date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#ede1d1]">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="mt-3 text-base text-[#a58e7c]">Loading recipe details...</Text>
            </SafeAreaView>
        );
    }

    if (error || !recipe) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#ede1d1] p-5">
                <Ionicons name="alert-circle-outline" size={64} color={COLORS.primary} />
                <Text className="mt-3 text-base text-[#a58e7c] text-center mb-5">
                    {error || "Recipe not found"}
                </Text>
                <TouchableOpacity
                    className="bg-[#e17055] px-5 py-3 rounded-full"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-semibold">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#ede1d1]">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                {/* Header with back button */}
                <View className="flex-row items-center px-4 py-2">
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-[#faf5eb] justify-center items-center"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
                    </TouchableOpacity>
                </View>

                {/* Recipe Title */}
                <View className="px-4 mb-4">
                    <Text className="text-2xl font-bold text-[#50372a] mb-2">{recipe.name}</Text>
                    <View className="flex-row flex-wrap mt-1">
                        <View className="flex-row items-center mr-4 mb-2">
                            <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                            <Text className="ml-1 text-sm text-[#a58e7c]">Prep: {recipe.prepTime}</Text>
                        </View>
                        <View className="flex-row items-center mr-4 mb-2">
                            <Ionicons name="flame-outline" size={18} color={COLORS.primary} />
                            <Text className="ml-1 text-sm text-[#a58e7c]">Cook: {recipe.cookTime}</Text>
                        </View>
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                            <Text className="ml-1 text-sm text-[#a58e7c]">
                                {recipe.createdAt ? formatDate(recipe.createdAt) : "Recently added"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Ingredients Section */}
                <View className="mb-6 px-4">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="list-outline" size={22} color={COLORS.primary} />
                        <Text className="text-xl font-bold text-[#50372a] ml-2">Ingredients</Text>
                    </View>
                    <View className="bg-[#faf5eb] rounded-xl p-4">
                        {recipe.ingredients.map((ingredient, index) => (
                            <View key={index} className="flex-row mb-2.5 items-start">
                                <View className="w-2 h-2 rounded-full bg-[#e17055] mt-1.5 mr-2.5" />
                                <Text className="flex-1 text-[15px] text-[#784e2d] leading-[22px]">{ingredient}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Instructions Section - Improved UI */}
                <View className="mb-6 px-4">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
                        <Text className="text-xl font-bold text-[#50372a] ml-2">Instructions</Text>
                    </View>
                    <View className="bg-[#faf5eb] rounded-xl p-4">
                        {recipe.instructions.map((instruction, index) => (
                            <View key={index} className="mb-5 last:mb-0">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-8 h-8 rounded-full bg-[#e17055] justify-center items-center">
                                        <Text className="text-white font-bold">{index + 1}</Text>
                                    </View>
                                    <Text className="ml-2 text-[16px] font-semibold text-[#50372a]">
                                        {`Step ${index + 1}`}
                                    </Text>
                                </View>
                                <View className="ml-10 bg-[#f7f2ea] p-3 rounded-lg border-l-4 border-[#e17055]">
                                    <Text className="text-[15px] text-[#784e2d] leading-[22px]">
                                        {instruction}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Serving Suggestion Section */}
                {recipe.servingSuggestion && (
                    <View className="mb-6 px-4">
                        <View className="flex-row items-center mb-3">
                            <Ionicons name="restaurant-outline" size={22} color={COLORS.primary} />
                            <Text className="text-xl font-bold text-[#50372a] ml-2">Serving Suggestion</Text>
                        </View>
                        <View className="bg-[#faf5eb] rounded-xl p-4">
                            <Text className="text-[15px] text-[#784e2d] leading-[22px] italic">
                                {recipe.servingSuggestion}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Bottom spacing */}
                <View className="h-8" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default DisplaySavedRecipe;