import {storeWithExpiry, getWithExpiry} from "@/utility/getCachedOrFetched";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TTL = 6 * 60 * 60 * 1000;

export interface PopularCategoriesProps {
    id: string;
    image: string;
    title: string;
}

export interface HealthyRecipesProps {
    id: string;
    image: string;
    nutrition: {
        nutrition: [];
    };
    title: string;
}

const API_KEY = process.env.EXPO_PUBLIC_SPOON_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

export const getPopularRecipes = async (): Promise<PopularCategoriesProps[]> => {
    const cacheKey = 'popular-recipes';

    try {
        const cachedData = await getWithExpiry<PopularCategoriesProps[]>(cacheKey);
        if (cachedData) return cachedData;

        const res = await fetch(`${BASE_URL}/recipes/complexSearch?sort=popularity&number=10&cuisine=Indian&apiKey=${API_KEY}`);
        const data = await res.json();
        const recipes = Array.isArray(data.results) ? data.results : [];

        await storeWithExpiry<PopularCategoriesProps[]>(cacheKey, recipes);
        return recipes;
    } catch (error) {
        console.error("Error fetching popular recipes:", error);
        return [];
    }
};


export const getHealthyRecipes = async (): Promise<HealthyRecipesProps[]> => {
    const cacheKey = 'healthy-recipes';

    try {
        const cachedData = await getWithExpiry<HealthyRecipesProps[]>(cacheKey);
        if (cachedData) return cachedData;

        const res = await fetch(`${BASE_URL}/recipes/complexSearch?maxCalories=300&number=10&cuisine=Indian&apiKey=${API_KEY}`);
        const data = await res.json();
        const recipes = Array.isArray(data.results) ? data.results : [];

        await storeWithExpiry<HealthyRecipesProps[]>(cacheKey, recipes);
        return recipes;
    } catch (error) {
        console.error("Error fetching healthy recipes:", error);
        return [];
    }
};


export const searchRecipes = async (query: string) => {
    try {
        const result = await fetch(`${BASE_URL}/recipes/complexSearch?query=${query}&apiKey=${API_KEY}`);
        const data = await result.json();
        console.log(data);
        return data.results || [];
    } catch (error) {
        console.error('Error searching recipes:', error);
        return [];
    }
};

export const fetchRecipesBasedOnCategory = async (category: string) => {
    try {
        const res = await fetch(
            `${BASE_URL}/recipes/complexSearch?type=dessert&number=20&cuisine=Indian&apiKey=${API_KEY}`
        );
        const data = await res.json();
        console.log("Full API Response:", data);

        if (data.totalResults === 0) {
            console.warn(`No recipes found for category: ${category}`);
        }

        return Array.isArray(data.results) ? data.results : [];
    } catch (error) {
        console.error("Error fetching recipes based on category:", error);
    }
};

export const fetchRecipesById = async (recipeId: string) => {
    const cacheKey = `recipe_${recipeId}`;

    try {
        const cachedData = await AsyncStorage.getItem(cacheKey);

        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            const isExpired = Date.now() - parsed.timestamp > TTL;

            if (!isExpired && parsed.data) {
                console.log(`Serving recipe ${recipeId} from cache.`);
                return parsed.data;
            }
        }

        // If cache expired or doesn't exist, fetch fresh data
        const response = await fetch(`${BASE_URL}/recipes/${recipeId}/information?apiKey=${API_KEY}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch recipe: ${response.statusText}`);
        }

        const data = await response.json();

        // Store fresh data in AsyncStorage with timestamp
        await AsyncStorage.setItem(
            cacheKey,
            JSON.stringify({ data, timestamp: Date.now() })
        );

        return data;
    } catch (error) {
        console.error("Error fetching recipes by id:", error);

        // If anything goes wrong, just return null (or optionally cached data if available)
        return null;
    }
};



