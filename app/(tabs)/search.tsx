import {FlatList, Text, TextInput, TouchableOpacity, View, Dimensions, ActivityIndicator} from 'react-native'
import React, {useState} from 'react'
import {COLORS} from "@/assets/colors";
import {Ionicons} from "@expo/vector-icons";
import {searchRecipes} from "@/api/recipes";
import {Image} from "expo-image";

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

    const handleSearchPress = async () => {
        if(!userType.trim()) return;

        setIsLoading(true);
        try {
            const recipes = await searchRecipes(userType);
            setResults(recipes);
            console.log("Searched Recipes", recipes);
        } catch (error) {
            console.log("Search error:", error);
        } finally {
            setIsLoading(false);
        }
    }

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
                    <TouchableOpacity onPress={handleSearchPress}>
                        <Ionicons name='search' size={24} color={COLORS.primary} />
                    </TouchableOpacity>
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

export default Search