import {Text, TextInput, TouchableOpacity, View, ScrollView, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {useAuthStore} from "@/store/useAuthStore";
import {COLORS} from "@/assets/colors";
import { Ionicons } from "@expo/vector-icons";

const Generate = () => {
    const [ingredients, setIngredients] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const {user} = useAuthStore();

    const handleGenerate = () => {
        if (!ingredients.trim()) return;
        setIsGenerating(true);
        // Your actual recipe generation logic would go here
    };

    return (
        <ScrollView
            className="flex-1 bg-[#ede1d1]"
            showsVerticalScrollIndicator={false}
        >
            <View className="p-5">
                <View className="mb-6">
                    <Text className="text-lg" style={{color: COLORS.textSecondary}}>Hello, {user?.displayName}</Text>
                    <Text className="text-2xl font-bold" style={{color: COLORS.textDark}}>Let's generate some recipes</Text>
                </View>

                <View className="mb-6">
                    <View className="flex-row items-start rounded-full border p-4" style={{backgroundColor: COLORS.inputBackground, borderColor: COLORS.border}}>
                        <Ionicons name="restaurant-outline" size={22} style={{color: COLORS.textSecondary, marginRight: 8, marginTop: 2}} />
                        <TextInput
                            className="flex-1 text-base"
                            style={{color: COLORS.textDark}}
                            placeholder="Enter your list of ingredients"
                            placeholderTextColor={COLORS.placeholderText}
                            value={ingredients}
                            onChangeText={(value) => setIngredients(value)}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    <Text className="text-xs mt-2 ml-1" style={{color: COLORS.textSecondary}}>
                        For example: chicken, garlic, onion, olive oil
                    </Text>
                </View>

                <TouchableOpacity
                    className="rounded-full py-3 px-6 flex-row items-center justify-center"
                    style={{backgroundColor: COLORS.primary}}
                    onPress={handleGenerate}
                    disabled={isGenerating || !ingredients.trim()}
                >
                    {isGenerating ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <>
                            <Ionicons name="nutrition-outline" size={20} style={{color: COLORS.white, marginRight: 8}} />
                            <Text className="text-base font-semibold" style={{color: COLORS.white}}>Generate Recipe</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View className="mt-8">
                    <Text className="text-lg font-semibold mb-3" style={{color: COLORS.textPrimary}}>Tips</Text>

                    <View className="flex-row items-start mb-2">
                        <Ionicons name="checkmark-circle" size={18} style={{color: COLORS.primary, marginRight: 8, marginTop: 1}} />
                        <Text style={{color: COLORS.textDark}}>List all ingredients you have available</Text>
                    </View>

                    <View className="flex-row items-start mb-2">
                        <Ionicons name="checkmark-circle" size={18} style={{color: COLORS.primary, marginRight: 8, marginTop: 1}} />
                        <Text style={{color: COLORS.textDark}}>Be specific about quantities when possible</Text>
                    </View>

                    <View className="flex-row items-start">
                        <Ionicons name="checkmark-circle" size={18} style={{color: COLORS.primary, marginRight: 8, marginTop: 1}} />
                        <Text style={{color: COLORS.textDark}}>Include spices and seasonings you have on hand</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Generate;