import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, SafeAreaView, StatusBar, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { fetchRecipesById } from '@/api/recipes';
import { COLORS } from '@/assets/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const displayPopularRecipe = () => {
    const { recipeId } = useLocalSearchParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchMyRecipeById = async () => {
            try {
                const response = await fetchRecipesById(recipeId as string);
                setRecipe(response);
            } catch (error) {
                console.error("Error fetching:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyRecipeById();
    }, [recipeId]);

    // Function to handle image errors
    const handleImageError = () => {
        setImageError(true);
    };

    if (loading) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.background
            }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 16, color: COLORS.textPrimary }}>Loading recipe...</Text>
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.background
            }}>
                <Ionicons name="alert-circle" size={60} color={COLORS.primary} />
                <Text style={{
                    color: COLORS.textPrimary,
                    fontSize: 18,
                    marginTop: 16,
                    textAlign: 'center'
                }}>
                    We couldn't find this recipe.
                </Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: COLORS.primary,
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 25,
                        marginTop: 20,
                    }}
                    onPress={() => router.back()}
                >
                    <Text style={{ color: COLORS.white, fontWeight: '600' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Parse the instructions into steps
    const instructionSteps = recipe.analyzedInstructions &&
    recipe.analyzedInstructions.length > 0 ?
        recipe.analyzedInstructions[0].steps : null;

    // Clean up HTML tags from description
    const cleanSummary = recipe.summary?.replace(/<[^>]*>?/gm, '');

    // Default fallback image in case the recipe image fails
    const fallbackImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60';

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: COLORS.background,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                {/* Header with back button and image */}
                <View style={{ position: 'relative' }}>
                    {/* Recipe Image */}
                    <Image
                        source={{ uri: imageError ? fallbackImage : recipe.image }}
                        style={{
                            width: width,
                            height: 300,
                        }}
                        resizeMode="cover"
                        onError={handleImageError}
                    />

                    {/* Image overlay gradient */}
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.15)',
                    }}/>

                    {/* Top navigation bar */}
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 16,
                    }}>
                        {/* Back button */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                borderRadius: 22,
                                width: 44,
                                height: 44,
                                justifyContent: 'center',
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.2,
                                shadowRadius: 2,
                                elevation: 3,
                            }}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
                        </TouchableOpacity>

                        {/* Save/Bookmark button */}
                        {/*<TouchableOpacity*/}
                        {/*    style={{*/}
                        {/*        backgroundColor: 'rgba(255,255,255,0.9)',*/}
                        {/*        borderRadius: 22,*/}
                        {/*        width: 44,*/}
                        {/*        height: 44,*/}
                        {/*        justifyContent: 'center',*/}
                        {/*        alignItems: 'center',*/}
                        {/*        shadowColor: '#000',*/}
                        {/*        shadowOffset: { width: 0, height: 1 },*/}
                        {/*        shadowOpacity: 0.2,*/}
                        {/*        shadowRadius: 2,*/}
                        {/*        elevation: 3,*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <Ionicons name="bookmark-outline" size={24} color={COLORS.primary} />*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                </View>

                {/* Recipe info card that overlaps the image */}
                <View style={{
                    backgroundColor: COLORS.cardBackground,
                    marginHorizontal: 16,
                    marginTop: -40,
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                }}>
                    {/* Recipe title */}
                    <Text style={{
                        fontSize: 24,
                        fontWeight: 'bold',
                        color: COLORS.textDark,
                        marginBottom: 12,
                    }}>
                        {recipe.title}
                    </Text>

                    {/* Recipe metadata */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingBottom: 16,
                        marginBottom: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: COLORS.border,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                backgroundColor: COLORS.primary + '15',
                                borderRadius: 8,
                                padding: 8,
                                marginRight: 8,
                            }}>
                                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={{
                                    color: COLORS.textSecondary,
                                    fontSize: 12
                                }}>
                                    Prep Time
                                </Text>
                                <Text style={{
                                    color: COLORS.textDark,
                                    fontWeight: '600'
                                }}>
                                    {recipe.readyInMinutes} min
                                </Text>
                            </View>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <View style={{
                                backgroundColor: COLORS.primary + '15',
                                borderRadius: 8,
                                padding: 8,
                                marginRight: 8,
                            }}>
                                <Ionicons name="people-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={{
                                    color: COLORS.textSecondary,
                                    fontSize: 12
                                }}>
                                    Servings
                                </Text>
                                <Text style={{
                                    color: COLORS.textDark,
                                    fontWeight: '600'
                                }}>
                                    {recipe.servings}
                                </Text>
                            </View>
                        </View>

                        {recipe.healthScore && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <View style={{
                                    backgroundColor: COLORS.primary + '15',
                                    borderRadius: 8,
                                    padding: 8,
                                    marginRight: 8,
                                }}>
                                    <Ionicons name="heart-outline" size={20} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={{
                                        color: COLORS.textSecondary,
                                        fontSize: 12
                                    }}>
                                        Health
                                    </Text>
                                    <Text style={{
                                        color: COLORS.textDark,
                                        fontWeight: '600'
                                    }}>
                                        {recipe.healthScore}%
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Recipe tags/diets if available */}
                    {recipe.diets && recipe.diets.length > 0 && (
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginBottom: 16,
                        }}>
                            {recipe.diets.map((diet: string, index: number) => (
                                <View
                                    key={`diet-tag-${index}`}
                                    style={{
                                        backgroundColor: COLORS.primary + '15',
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 16,
                                        marginRight: 8,
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text style={{
                                        color: COLORS.primary,
                                        fontSize: 12,
                                        fontWeight: '500',
                                    }}>
                                        {diet}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Recipe summary */}
                    <Text style={{
                        color: COLORS.textSecondary,
                        lineHeight: 22,
                        fontSize: 15,
                    }}>
                        {cleanSummary}
                    </Text>
                </View>

                {/* Main content section */}
                <View style={{ padding: 16 }}>
                    {/* Ingredients Card */}
                    <View style={{
                        backgroundColor: COLORS.cardBackground,
                        borderRadius: 20,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.06,
                        shadowRadius: 6,
                        elevation: 2,
                        overflow: 'hidden',
                    }}>
                        {/* Card header */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.border,
                            backgroundColor: COLORS.primary + '08',
                        }}>
                            <Ionicons
                                name="list"
                                size={22}
                                color={COLORS.primary}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: COLORS.textPrimary,
                            }}>
                                Ingredients
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: COLORS.textSecondary,
                                marginLeft: 'auto',
                            }}>
                                {recipe.extendedIngredients?.length} items
                            </Text>
                        </View>

                        {/* Ingredients list */}
                        <View style={{ padding: 16 }}>
                            {recipe.extendedIngredients?.map((item: any, index: number) => (
                                <View
                                    // Using index as part of key to guarantee uniqueness
                                    key={`ingredient-${index}-unique`}
                                    style={{
                                        flexDirection: 'row',
                                        paddingVertical: 12,
                                        alignItems: 'center',
                                        borderBottomWidth: index !== recipe.extendedIngredients.length - 1 ? 1 : 0,
                                        borderBottomColor: COLORS.border,
                                    }}
                                >
                                    {/* Ingredient number */}
                                    <View style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 14,
                                        backgroundColor: COLORS.primary,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 12,
                                    }}>
                                        <Text style={{
                                            color: COLORS.white,
                                            fontSize: 14,
                                            fontWeight: '600'
                                        }}>
                                            {index + 1}
                                        </Text>
                                    </View>

                                    {/* Ingredient name */}
                                    <Text style={{
                                        flex: 1,
                                        color: COLORS.textSecondary,
                                        fontSize: 16,
                                        paddingRight: 8,
                                    }}>
                                        {item.original}
                                    </Text>

                                    {/* Amount if available */}
                                    {item.amount && item.unit && (
                                        <Text style={{
                                            color: COLORS.textDark,
                                            fontWeight: '500',
                                            backgroundColor: COLORS.primary + '10',
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            borderRadius: 12,
                                            overflow: 'hidden',
                                            fontSize: 13,
                                        }}>
                                            {item.amount} {item.unit}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Instructions Card */}
                    <View style={{
                        backgroundColor: COLORS.cardBackground,
                        borderRadius: 20,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.06,
                        shadowRadius: 6,
                        elevation: 2,
                        overflow: 'hidden',
                    }}>
                        {/* Card header */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: COLORS.border,
                            backgroundColor: COLORS.primary + '08',
                        }}>
                            <Ionicons
                                name="restaurant-outline"
                                size={22}
                                color={COLORS.primary}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: COLORS.textPrimary,
                            }}>
                                Cooking Instructions
                            </Text>
                            {instructionSteps && (
                                <Text style={{
                                    fontSize: 14,
                                    color: COLORS.textSecondary,
                                    marginLeft: 'auto',
                                }}>
                                    {instructionSteps.length} steps
                                </Text>
                            )}
                        </View>

                        {/* Instructions content */}
                        <View style={{ padding: 16 }}>
                            {instructionSteps ? (
                                // Structured step-by-step instructions
                                instructionSteps.map((step: any, index: number) => (
                                    <View
                                        key={`step-${index}`}
                                        style={{
                                            marginBottom: index !== instructionSteps.length - 1 ? 24 : 8,
                                        }}
                                    >
                                        {/* Step header */}
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginBottom: 10,
                                        }}>
                                            <View style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 18,
                                                backgroundColor: COLORS.primary,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginRight: 12,
                                            }}>
                                                <Text style={{
                                                    color: COLORS.white,
                                                    fontSize: 16,
                                                    fontWeight: 'bold'
                                                }}>
                                                    {step.number}
                                                </Text>
                                            </View>
                                            <Text style={{
                                                color: COLORS.textDark,
                                                fontSize: 16,
                                                fontWeight: '600',
                                            }}>
                                                Step {step.number}
                                            </Text>
                                        </View>

                                        {/* Step content */}
                                        <View style={{
                                            backgroundColor: index % 2 === 0 ? COLORS.primary + '08' : 'transparent',
                                            borderRadius: 12,
                                            padding: 12,
                                            marginLeft: 48,
                                            borderLeftWidth: 2,
                                            borderLeftColor: COLORS.primary,
                                        }}>
                                            <Text style={{
                                                color: COLORS.textSecondary,
                                                lineHeight: 22,
                                                fontSize: 15,
                                            }}>
                                                {step.step}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                // Fallback for unstructured instructions
                                <Text style={{
                                    color: COLORS.textDark,
                                    lineHeight: 24,
                                    padding: 8,
                                }}>
                                    {recipe.instructions?.replace(/<[^>]*>?/gm, '') || 'No instructions provided.'}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default displayPopularRecipe;