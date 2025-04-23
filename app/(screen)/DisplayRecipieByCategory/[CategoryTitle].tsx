import { Text, View, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { fetchRecipesBasedOnCategory } from '@/api/recipes';
import {COLORS} from "@/assets/colors";

interface Recipe {
    id: number;
    image: string;
    title: string;
}

const DisplayRecipeByCategory = () => {
    const { CategoryTitle } = useLocalSearchParams();
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

    const renderItem = ({ item }: { item: Recipe }) => (
        <View className="flex-row items-center mb-4 bg-cardBackground p-4 rounded-lg">
            <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg mr-4" />
            <Text className="text-textPrimary text-lg font-semibold flex-shrink-1">{item.title}</Text>
        </View>
    );

    return (
        <View className="flex-1 p-4 bg-background">
            <Text className="text-textPrimary text-2xl font-bold mb-6">Category: {CategoryTitle}</Text>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : error ? (
                <Text className="text-red-600 text-center text-lg">{error}</Text>
            ) : (
                <FlatList
                    data={recipes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
};

export default DisplayRecipeByCategory;
