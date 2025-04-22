import {ScrollView, Text, TextInput, View, Dimensions, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import { useAuthStore } from "@/store/useAuthStore"
import { Ionicons } from "@expo/vector-icons"
import {COLORS} from "@/assets/colors";
import PopularCategories from "@/components/PopularCategories";
import {getHealthyRecipes, getPopularRecipes} from "@/api/recipes";
import {Image} from "expo-image";
import { useRouter } from "expo-router";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;

interface PopularCategoriesProps {
    id: string;
    image: string;
    title: string;
}

interface HealthyRecipesProps {
    id: string;
    image: string;
    nutrition: {
        nutrition: [];
    },
    title: string;
}

const Index = () => {
    const [popularRecipes, setPopularRecipes] = useState([])
    const [healthyRecipes, setHealthyRecipes] = useState([])
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const fetchPopularRecipes = async () => {
            try {
                const res = await getPopularRecipes();
                setPopularRecipes(res)
            }catch (error){
                console.log(error)
            }
        }
        fetchPopularRecipes()
    }, []);

    useEffect(() => {
        const fetchHealtyRecipe = async () => {
            try {
                const res = await getHealthyRecipes();
                setHealthyRecipes(res)
            }catch (error){
                console.log(error)
            }
        }
        fetchHealtyRecipe();
    }, []);

    const handleSearchPress = () => {
        router.push("/search");
    };

    // Function to a truncate text with ellipsis
    const truncateText = (text: any, maxLength = 20) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
        <ScrollView
            style={{ backgroundColor: COLORS.background, flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
        >
            <View className="flex-col p-5">
                <Text style={{ fontSize: 20, color: COLORS.textSecondary }}>Hello, {user?.displayName}</Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.textDark }}>What would you like to cook today?</Text>
            </View>

            <TouchableOpacity onPress={handleSearchPress} className="px-5 mb-4">
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: COLORS.inputBackground,
                    borderColor: COLORS.border,
                    borderWidth: 1,
                    borderRadius: 24
                }}>
                    <Ionicons name='search' size={20} color={COLORS.textSecondary} />
                    <TextInput
                        style={{ flex: 1, marginLeft: 8, fontSize: 16, color: COLORS.textDark }}
                        placeholder='Search your recipe...'
                        placeholderTextColor={COLORS.placeholderText}
                        editable={false}
                    />
                </View>
            </TouchableOpacity>

            <PopularCategories />

            <View className="px-5 mb-2">
                <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8, color: COLORS.textPrimary }}>Popular Recipes in India</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                    contentContainerStyle={{ paddingRight: 16 }}
                >
                    {popularRecipes.map((recipe: PopularCategoriesProps) => (
                        <View
                            key={recipe.id}
                            style={{
                                backgroundColor: COLORS.cardBackground,
                                padding: 12,
                                borderRadius: 12,
                                alignItems: 'center',
                                marginRight: 12,
                                width: CARD_WIDTH,
                                shadowColor: COLORS.black,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                        >
                            <Image
                                source={{uri: recipe.image}}
                                style={{
                                    width: '100%',
                                    height: 160,
                                    borderRadius: 8
                                }}
                                contentFit="cover"
                                transition={300}
                            />
                            <Text
                                style={{
                                    marginTop: 8,
                                    fontSize: 15,
                                    fontWeight: '600',
                                    color: COLORS.textPrimary,
                                    textAlign: 'center'
                                }}
                                numberOfLines={1}
                            >
                                {truncateText(recipe.title)}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View className="px-5 pt-2">
                <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8, color: COLORS.textPrimary }}>Healthy Recipes</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                    contentContainerStyle={{ paddingRight: 16 }}
                >
                    {healthyRecipes.map((recipe: HealthyRecipesProps) => (
                        <View
                            key={recipe.id}
                            style={{
                                backgroundColor: COLORS.cardBackground,
                                padding: 12,
                                borderRadius: 12,
                                alignItems: 'center',
                                marginRight: 12,
                                width: CARD_WIDTH,
                                shadowColor: COLORS.black,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                        >
                            <Image
                                source={{uri: recipe.image}}
                                style={{
                                    width: '100%',
                                    height: 160,
                                    borderRadius: 8
                                }}
                                contentFit="cover"
                                transition={300}
                            />
                            <Text
                                style={{
                                    marginTop: 8,
                                    fontSize: 15,
                                    fontWeight: '600',
                                    color: COLORS.textPrimary,
                                    textAlign: 'center'
                                }}
                                numberOfLines={1}
                            >
                                {truncateText(recipe.title)}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    )
}

export default Index