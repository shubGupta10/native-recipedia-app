import {getCachedOrFetch} from '@/utility/getCachedOrFetched'

const API_KEY= process.env.EXPO_PUBLIC_SPOON_API_KEY!;

const BASE_URL = "https://api.spoonacular.com";

export const getPopularRecipes = () => {
    return getCachedOrFetch("popular_recipes", async () => {
        const res = await fetch(`${BASE_URL}/recipes/complexSearch?sort=popularity&number=10&cuisine=Indian&apiKey=${API_KEY}`);
        const data = await res.json();
        return Array.isArray(data.results) ? data.results : [];
    });
};

export const getHealthyRecipes = () => {
    return getCachedOrFetch("healthy_recipes", async () => {
        const res = await fetch(`${BASE_URL}/recipes/complexSearch?maxCalories=300&number=10&cuisine=Indian&apiKey=${API_KEY}`);
        const data = await res.json();
        return Array.isArray(data.results) ? data.results : [];
    });
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
    const cacheKey = `recipes_${category}`;

    return getCachedOrFetch(cacheKey, async () => {
        try {
            const res = await fetch(`${BASE_URL}/recipes/complexSearch?category=${category}&number=10&cuisine=Indian&apiKey=${API_KEY}`);
            const data = await res.json();
            return Array.isArray(data.results) ? data.results : [];
        } catch (error) {
            console.error("Error fetching recipes based on category:", error);
            return [];
        }
    });
};


