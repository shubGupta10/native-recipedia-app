import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const fetchAndCache = async <T>(key: string, url: string): Promise<T[]> => {
    try {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }

        const res = await fetch(url);
        const result = await res.json();
        const fetchedData = Array.isArray(result.results) ? result.results : [];

        await AsyncStorage.setItem(key, JSON.stringify({
            timestamp: Date.now(),
            data: fetchedData,
        }));

        return fetchedData;
    } catch (error) {
        console.error(`Error fetching or caching ${key}:`, error);
        return [];
    }
};


export const fetchAndCacheForCategory = async <T>(key: string, fetchFn: () => Promise<T[]>): Promise<T[]> => {
    try {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                return data;
            }
        }

        const data = await fetchFn();
        await AsyncStorage.setItem(
            key,
            JSON.stringify({ timestamp: Date.now(), data })
        );

        return data;
    } catch (error) {
        console.error(`Error in fetchAndCache for key: ${key}`, error);
        return [];
    }
};


export const storeWithExpiry = async <T>(key: string, value: T, ttlInHours = 24): Promise<void> => {
    const now = new Date();
    const item = {
        value,
        expiry: now.getTime() + ttlInHours * 60 * 60 * 1000, // 24 hours in ms
    };
    await AsyncStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = async <T>(key: string): Promise<T | null> => {
    const itemStr = await AsyncStorage.getItem(key);
    if (!itemStr) return null;

    try {
        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
            await AsyncStorage.removeItem(key);
            return null;
        }
        return item.value as T;
    } catch (err) {
        console.error("Error parsing stored data", err);
        return null;
    }
};
