const API_KEY= process.env.EXPO_PUBLIC_SPOON_API_KEY!;

const BASE_URL = "https://api.spoonacular.com";

export const getRandomRecipes = async () => {
    const res = await fetch(`${BASE_URL}/recipes/random?number=10&apikey=${API_KEY}`);
    const data = await res.json();
    return data.recipes[0];
}

export const getPopularRecipes = async () => {
    try {
        const res = await fetch(`${BASE_URL}/recipes/complexSearch?sort=popularity&number=10&cuisine=Indian&apiKey=${API_KEY}`);
        const data = await res.json();
        return Array.isArray(data.results) ? data.results : [];
    } catch (error) {
        console.error("Error fetching popular recipes:", error);
        return [];
    }
};

export const getHealthyRecipes = async () => {
    try {
        const res = await fetch(`${BASE_URL}/recipes/complexSearch?maxCalories=300&number=10&cuisine=Indian&apiKey=${API_KEY}`);
        const data = await res.json();
        return Array.isArray(data.results) ? data.results : [];
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


