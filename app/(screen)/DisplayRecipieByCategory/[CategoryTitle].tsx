import { Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchRecipesBasedOnCategory } from '@/api/recipes';
import { COLORS } from "@/assets/colors";
import { AntDesign } from '@expo/vector-icons';

interface Recipe {
    id: number;
    image: string;
    title: string;
}

const DisplayRecipeByCategory = () => {
    const { CategoryTitle } = useLocalSearchParams();
    const router = useRouter();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchByCategory = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await fetchRecipesBasedOnCategory(CategoryTitle as string);
                setRecipes(result);
            } catch (err) {
                setError('Error fetching recipes.');
            } finally {
                setLoading(false);
            }
        };

        fetchByCategory();
    }, [CategoryTitle]);

    const handleGoBack = () => {
        router.back();
    };

    const renderItem = ({ item }: { item: Recipe }) => (
        <Pressable 
            className="mb-4"
            onPress={() => router.push({
                pathname: '/(screen)/displayPopularRecipe/[recipeId]',
                params: { recipeId: item.id.toString() },
            })}
        >
            <View className="flex-row items-center bg-cardBackground p-4 rounded-xl shadow-sm">
                <Image 
                    source={{ uri: item.image }} 
                    className="w-20 h-20 rounded-lg mr-4" 
                    resizeMode="cover"
                />
                <Text className="text-textPrimary text-lg font-semibold flex-1">{item.title}</Text>
            </View>
        </Pressable>
    );

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* Header with Back Button */}
            <View className="flex-row items-center pt-12 pb-4 px-4" style={{ backgroundColor: COLORS.cardBackground }}>
                <TouchableOpacity 
                    onPress={handleGoBack}
                    className="p-2 mr-4 rounded-full"
                    style={{ backgroundColor: COLORS.white }}
                >
                    <AntDesign name="arrowleft" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text className="text-xl font-bold flex-1" style={{ color: COLORS.textDark }}>{CategoryTitle}</Text>
            </View>

            {/* Content */}
            <View className="flex-1 px-4 pt-4">
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={{ color: COLORS.textSecondary }} className="mt-4">Loading recipes...</Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-red-600 text-center text-lg">{error}</Text>
                        <TouchableOpacity 
                            className="mt-4 px-6 py-3 rounded-full"
                            style={{ backgroundColor: COLORS.primary }}
                        >
                            <Text style={{ color: COLORS.white }} className="font-semibold">Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : recipes.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <Text style={{ color: COLORS.textSecondary }} className="text-lg text-center">No recipes found for this category.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={recipes}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
};

export default DisplayRecipeByCategory;