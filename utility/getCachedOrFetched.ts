import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_DURATION = 24*60*60*1000; // 24h

export const getCachedOrFetch = async (key: string, fetchFn: () => Promise<any>) => {
    try {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log("Serving from cache:", key);
                return data;
            }
        }

        const data = await fetchFn();
        await AsyncStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
        return data;

    } catch (err) {
        console.error("Cache fetch error:", err);
        return fetchFn(); // fallback to API
    }
};