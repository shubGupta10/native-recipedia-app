import {Text, TextInput, TouchableOpacity, View, ScrollView, ActivityIndicator, Alert, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuthStore} from "@/store/useAuthStore";
import {COLORS} from "@/assets/colors";
import {Ionicons} from "@expo/vector-icons";
import {GenerateRecipes, saveRecipeToFirestore} from "@/firebase/firebaseFunctions";
import Markdown from 'react-native-markdown-display';

interface RecipeResponse {
    name: string;
    prepTime: string;
    cookTime: string;
    ingredients: string[];
    instructions: string[];
    servingSuggestion: string;
}

interface ApiResponse {
    content: string;
    message: string;
}

const Generate = () => {
    const [ingredientsText, setIngredientsText] = useState('');
    const [recipeResponse, setRecipeResponse] = useState<RecipeResponse | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const {user} = useAuthStore();
    const [userId, setUserId] = useState<string | "">("");

    useEffect(() => {
        setUserId(user?.uid as string)
    }, [user]);

    const handleGenerate = async () => {
        if (!ingredientsText.trim()) return;

        const ingredientsArray = ingredientsText
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);

        setIsGenerating(true);
        setError('');

        try {
            const result = await GenerateRecipes(ingredientsArray);
            let parsedResult: RecipeResponse;

            if (typeof result === 'object' && result !== null) {
                if ('content' in result) {
                    const apiResponse = result as ApiResponse;
                    const jsonContent = extractJsonFromCodeBlock(apiResponse.content);
                    parsedResult = JSON.parse(jsonContent);
                } else {
                    parsedResult = result as RecipeResponse;
                }
            } else if (typeof result === 'string') {
                try {
                    const jsonContent = extractJsonFromCodeBlock(result);
                    parsedResult = JSON.parse(jsonContent);
                } catch (parseError) {
                    console.error("Error parsing recipe JSON:", parseError);
                    setError("Sorry, couldn't parse the recipe. Please try again.");
                    setIsGenerating(false);
                    return;
                }
            } else {
                throw new Error("Invalid response format");
            }

            setRecipeResponse(parsedResult);
        } catch (error) {
            console.error("Error generating recipe:", error);
            setError("Sorry, there was an error generating your recipe. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const extractJsonFromCodeBlock = (content: string): string => {
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
            return codeBlockMatch[1].trim();
        }
        return content;
    };

    const handleSaveReceipe = async () => {
        try {
            if (!userId || !recipeResponse) {
                Alert.alert("Missing data", "User ID or recipe is missing.");
                return;
            }

            await saveRecipeToFirestore(userId, recipeResponse);

            Alert.alert(
                "Recipe Saved",
                "Your recipe has been saved successfully!"
            );
        } catch (error) {
            console.error("Error saving recipe:", error);
            Alert.alert("Error", "Something went wrong while saving the recipe.");
        }
    };

    // Enhanced Recipe Display Component
    const RecipeDisplay = () => {
        if (!recipeResponse) return null;
        
        return (
            <View className="bg-white rounded-xl p-5 mb-4 shadow-md" style={{backgroundColor: COLORS.cardBackground}}>
                {/* Recipe Title */}
                <View className="mb-4 border-b pb-3" style={{borderColor: COLORS.border}}>
                    <Text className="text-2xl font-bold" style={{color: COLORS.textPrimary}}>
                        {recipeResponse.name}
                    </Text>
                </View>
                
                {/* Cooking Time Info */}
                <View className="flex-row items-center justify-between mb-6 px-2">
                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={20} style={{color: COLORS.primary, marginRight: 6}} />
                        <View>
                            <Text className="text-sm font-medium" style={{color: COLORS.textSecondary}}>Prep Time</Text>
                            <Text className="text-base font-semibold" style={{color: COLORS.textDark}}>{recipeResponse.prepTime}</Text>
                        </View>
                    </View>
                    
                    <View className="h-10 w-0.5" style={{backgroundColor: COLORS.border}} />
                    
                    <View className="flex-row items-center">
                        <Ionicons name="flame-outline" size={20} style={{color: COLORS.primary, marginRight: 6}} />
                        <View>
                            <Text className="text-sm font-medium" style={{color: COLORS.textSecondary}}>Cook Time</Text>
                            <Text className="text-base font-semibold" style={{color: COLORS.textDark}}>{recipeResponse.cookTime}</Text>
                        </View>
                    </View>
                </View>
                
                {/* Ingredients Section */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="basket-outline" size={20} style={{color: COLORS.primary, marginRight: 8}} />
                        <Text className="text-xl font-semibold" style={{color: COLORS.textPrimary}}>Ingredients</Text>
                    </View>
                    <View className="bg-gray-50 rounded-lg p-4" style={{backgroundColor: COLORS.background}}>
                        {recipeResponse.ingredients && recipeResponse.ingredients.map((ingredient, index) => (
                            <View key={index} className="flex-row items-start mb-2">
                                <View className="w-2 h-2 rounded-full mt-2 mr-3" style={{backgroundColor: COLORS.primary}} />
                                <Text className="text-base flex-1" style={{color: COLORS.textDark}}>{ingredient}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                {/* Instructions Section */}
                <View className="mb-6">
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="list-outline" size={20} style={{color: COLORS.primary, marginRight: 8}} />
                        <Text className="text-xl font-semibold" style={{color: COLORS.textPrimary}}>Instructions</Text>
                    </View>
                    <View className="bg-gray-50 rounded-lg p-4" style={{backgroundColor: COLORS.background}}>
                        {recipeResponse.instructions && recipeResponse.instructions.map((instruction, index) => (
                            <View key={index} className="flex-row mb-4">
                                <View className="w-6 h-6 rounded-full items-center justify-center mr-3" style={{backgroundColor: COLORS.primary}}>
                                    <Text className="text-xs font-bold" style={{color: COLORS.white}}>{index + 1}</Text>
                                </View>
                                <Text className="text-base flex-1" style={{color: COLORS.textDark}}>{instruction}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                
                {/* Serving Suggestion */}
                <View>
                    <View className="flex-row items-center mb-3">
                        <Ionicons name="restaurant-outline" size={20} style={{color: COLORS.primary, marginRight: 8}} />
                        <Text className="text-xl font-semibold" style={{color: COLORS.textPrimary}}>Serving Suggestion</Text>
                    </View>
                    <View className="bg-gray-50 rounded-lg p-4" style={{backgroundColor: COLORS.background}}>
                        <Text className="text-base" style={{color: COLORS.textDark}}>{recipeResponse.servingSuggestion}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: COLORS.background}}
        >
            {!recipeResponse ? (
                // Input section - show when no recipe yet
                <View className="p-6">
                    <View className="mb-8">
                        <Text className="text-lg mb-1" style={{color: COLORS.textSecondary}}>
                            Hello, {user?.displayName || 'Chef'}
                        </Text>
                        <Text className="text-3xl font-bold" style={{color: COLORS.textDark}}>
                            Let's cook something amazing
                        </Text>
                        <View className="h-1 w-24 mt-3 rounded-full" style={{backgroundColor: COLORS.primary}} />
                    </View>

                    <View className="mb-8">
                        <Text className="text-lg font-semibold mb-3" style={{color: COLORS.textPrimary}}>
                            What ingredients do you have?
                        </Text>
                        <View
                            className="rounded-xl border p-4 shadow-sm"
                            style={{
                                backgroundColor: COLORS.inputBackground,
                                borderColor: COLORS.border
                            }}
                        >
                            <View className="flex-row items-start">
                                <Ionicons
                                    name="basket-outline"
                                    size={22}
                                    style={{color: COLORS.textSecondary, marginRight: 10, marginTop: 3}}
                                />
                                <TextInput
                                    className="flex-1 text-base"
                                    style={{color: COLORS.textDark}}
                                    placeholder="Enter your ingredients separated by commas"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={ingredientsText}
                                    onChangeText={setIngredientsText}
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>

                        <Text className="text-sm mt-3 ml-1" style={{color: COLORS.textSecondary}}>
                            For example: chicken, garlic, onion, olive oil, basil
                        </Text>
                    </View>

                    {error ? (
                        <View className="mb-5 p-4 rounded-lg" style={{backgroundColor: '#fae3e3'}}>
                            <Text style={{color: '#d63031'}}>{error}</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        className="rounded-xl py-4 px-6 flex-row items-center justify-center shadow-sm mb-8"
                        style={{backgroundColor: COLORS.primary}}
                        onPress={handleGenerate}
                        disabled={isGenerating || !ingredientsText.trim()}
                        activeOpacity={0.8}
                    >
                        {isGenerating ? (
                            <ActivityIndicator color={COLORS.white} size="small" />
                        ) : (
                            <>
                                <Ionicons name="restaurant-outline" size={22} style={{color: COLORS.white, marginRight: 10}} />
                                <Text className="text-lg font-semibold" style={{color: COLORS.white}}>Create My Recipe</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View className="bg-white rounded-xl p-5 shadow-sm" style={{backgroundColor: COLORS.cardBackground}}>
                        <View className="flex-row items-center mb-4">
                            <Ionicons name="bulb-outline" size={24} style={{color: COLORS.primary, marginRight: 10}} />
                            <Text className="text-xl font-semibold" style={{color: COLORS.textPrimary}}>Tips for Better Recipes</Text>
                        </View>

                        <View className="flex-row items-start mb-3">
                            <View style={{backgroundColor: COLORS.primary, borderRadius: 12, padding: 2, marginTop: 2, marginRight: 12}}>
                                <Ionicons name="checkmark" size={16} style={{color: COLORS.white}} />
                            </View>
                            <Text style={{color: COLORS.textDark, flex: 1, fontSize: 16}}>List all ingredients you have available</Text>
                        </View>

                        <View className="flex-row items-start mb-3">
                            <View style={{backgroundColor: COLORS.primary, borderRadius: 12, padding: 2, marginTop: 2, marginRight: 12}}>
                                <Ionicons name="checkmark" size={16} style={{color: COLORS.white}} />
                            </View>
                            <Text style={{color: COLORS.textDark, flex: 1, fontSize: 16}}>Be specific about quantities when possible</Text>
                        </View>

                        <View className="flex-row items-start">
                            <View style={{backgroundColor: COLORS.primary, borderRadius: 12, padding: 2, marginTop: 2, marginRight: 12}}>
                                <Ionicons name="checkmark" size={16} style={{color: COLORS.white}} />
                            </View>
                            <Text style={{color: COLORS.textDark, flex: 1, fontSize: 16}}>Include spices and seasonings you have on hand</Text>
                        </View>
                    </View>
                </View>
            ) : (
                // Recipe display section - improved UI
                <View className="p-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-2xl font-bold" style={{color: COLORS.textPrimary}}>Your Recipe</Text>
                            <View className="h-1 w-20 mt-2 rounded-full" style={{backgroundColor: COLORS.primary}} />
                        </View>
                        <TouchableOpacity
                            className="py-3 px-5 rounded-xl flex-row items-center shadow-sm"
                            style={{backgroundColor: COLORS.primary}}
                            onPress={() => setRecipeResponse(null)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add-circle-outline" size={18} style={{color: COLORS.white, marginRight: 6}} />
                            <Text className="font-semibold" style={{color: COLORS.white}}>New Recipe</Text>
                        </TouchableOpacity>
                    </View>

                    <RecipeDisplay />

                    <TouchableOpacity
                        onPress={handleSaveReceipe}
                        className="flex-row items-center justify-center py-4 px-5 rounded-xl shadow-sm mb-8"
                        style={{backgroundColor: COLORS.primary}}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="bookmark-outline" size={20} style={{color: COLORS.white, marginRight: 8}} />
                        <Text className="text-lg font-semibold" style={{color: COLORS.white}}>Save Recipe</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

export default Generate;