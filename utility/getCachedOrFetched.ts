import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const fetchAndCache = async <T>(key: string, url: string): Promise<T[]> => {
    try {
        const cached = await AsyncStorage.getItem(key);
        
        // Check if we have cached data and it's not expired
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
            // If expired, remove the cached data
            await AsyncStorage.removeItem(key);
        }
        
        // Fetch fresh data
        const res = await fetch(url);
        const result = await res.json();
        const fetchedData = Array.isArray(result.results) ? result.results : [];
        
        // Only cache if we have data
        if (fetchedData.length > 0) {
            await AsyncStorage.setItem(key, JSON.stringify({
                timestamp: Date.now(),
                data: fetchedData,
            }));
        }
        
        return fetchedData;
    } catch (error) {
        console.error(`Error fetching or caching ${key}:`, error);
        return [];
    }
};

export const fetchAndCacheForCategory = async <T>(key: string, fetchFn: () => Promise<T[]>): Promise<T[]> => {
    try {
        const cached = await AsyncStorage.getItem(key);
        
        // Check if we have cached data and it's not expired
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
            // If expired, remove the cached data
            await AsyncStorage.removeItem(key);
        }
        
        // Fetch fresh data
        const data = await fetchFn();
        
        // Only cache if we have data
        if (data && data.length > 0) {
            await AsyncStorage.setItem(
                key,
                JSON.stringify({ timestamp: Date.now(), data })
            );
        }
        
        return data;
    } catch (error) {
        console.error(`Error in fetchAndCache for key: ${key}`, error);
        return [];
    }
};

export const storeWithExpiry = async <T>(key: string, value: T, ttlInHours = 24): Promise<void> => {
    try {
        const now = new Date();
        const item = {
            value,
            expiry: now.getTime() + ttlInHours * 60 * 60 * 1000, // hours to ms
        };
        await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.error(`Error storing data with expiry for key: ${key}`, error);
    }
};

export const getWithExpiry = async <T>(key: string): Promise<T | null> => {
    try {
        const itemStr = await AsyncStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        const now = new Date();
        
        // Check if the item is expired
        if (now.getTime() > item.expiry) {
            // Remove expired item from storage
            await AsyncStorage.removeItem(key);
            return null;
        }
        
        return item.value as T;
    } catch (err) {
        console.error(`Error parsing stored data for key: ${key}`, err);
        // If there's an error, remove the potentially corrupted data
        await AsyncStorage.removeItem(key);
        return null;
    }
};