import {FlatList, Text, TextInput, TouchableOpacity, View, Dimensions, ActivityIndicator} from 'react-native'
import React, {useState, useEffect, useCallback} from 'react'
import {COLORS} from "@/assets/colors";
import {Ionicons} from "@expo/vector-icons";
import {searchRecipes} from "@/api/recipes";
import {Image} from "expo-image";
import {router} from "expo-router";

const {width} = Dimensions.get('window');

interface RecipeItem {
    id: string;
    title: string;
    image: string;
}

const Search = () => {
    const [userType, setUserType] = useState<string>("");
    const [results, setResults] = useState<RecipeItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Debounced search function
    const debouncedSearch = useCallback(
        // Create a debounced version of the search function
        debounce(async (searchTerm: string) => {
            if(!searchTerm.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const recipes = await searchRecipes(searchTerm);
                setResults(recipes);
                console.log("Searched Recipes", recipes);
            } catch (error) {
                console.log("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    // Effect to trigger search when userType changes
    useEffect(() => {
        debouncedSearch(userType);

        // Cleanup function to cancel pending debounced calls when component unmounts
        return () => {
            debouncedSearch.cancel();
        };
    }, [userType, debouncedSearch]);

    const renderRecipeItem = ({item}: {item: RecipeItem}) => (
        <TouchableOpacity
            style={{
                backgroundColor: COLORS.cardBackground,
                borderRadius: 12,
                marginBottom: 12,
                overflow: 'hidden',
                shadowColor: COLORS.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
            }}
            onPress={() => router.push({
                pathname: "/(screen)/displayPopularRecipe/[recipeId]",
                params: {recipeId: item.id}
            })}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={{uri: item.image}}
                    style={{
                        width: 80,
                        height: 80,
                        borderTopLeftRadius: 12,
                        borderBottomLeftRadius: 12,
                    }}
                    contentFit="cover"
                    transition={300}
                />
                <View style={{
                    flex: 1,
                    padding: 12,
                }}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: COLORS.textPrimary,
                            marginBottom: 4,
                        }}
                        numberOfLines={2}
                    >
                        {item.title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <View className="p-5">
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.inputBackground,
                    borderColor: COLORS.border,
                    borderWidth: 1,
                    borderRadius: 24,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    marginBottom: 16,
                }}>
                    <TextInput
                        style={{
                            flex: 1,
                            fontSize: 16,
                            color: COLORS.textDark,
                            marginRight: 8,
                        }}
                        placeholder='Search your recipe...'
                        placeholderTextColor={COLORS.placeholderText}
                        value={userType}
                        onChangeText={(value: string) => setUserType(value)}
                    />
                    <Ionicons name='search' size={24} color={COLORS.primary} />
                </View>

                {isLoading ? (
                    <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : results.length > 0 ? (
                    <FlatList
                        data={results}
                        renderItem={renderRecipeItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : userType.trim() ? (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                        <Text style={{ color: COLORS.textSecondary, fontSize: 16, textAlign: 'center' }}>
                            No recipes found for "{userType}"
                        </Text>
                    </View>
                ) : null}
            </View>
        </View>
    )
}

// Debounce utility function
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout | null = null;

    const debounced = function(...args: any[]) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };

    debounced.cancel = function() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced;
}

export default Search