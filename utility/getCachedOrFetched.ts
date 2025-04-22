import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_DURATION = 24*60*60*1000; // 24h

export const getCachedOrFetch = async <T>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
    try {
        // Check if data exists in cache
        const cached = await AsyncStorage.getItem(key);

        if (cached) {
            const parsedCache = JSON.parse(cached);
            const { data, timestamp } = parsedCache;

            // Check if cache is still valid
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log("Serving from cache:", key);
                return data;
            }
            // Cache expired, will fetch new data
        }

        // Fetch new data if no cache or expired
        console.log("Fetching fresh data for:", key);
        const data = await fetchFn();
        console.log("Fetching fresh data:", key);

        // Store the new data in cache
        await AsyncStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now()
        }));

        return data;
    } catch (err) {
        console.error("Cache fetch error:", err);
        // If there's an error with the cache, fallback to API
        return fetchFn();
    }
};