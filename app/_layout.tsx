import {Stack, useRouter, useSegments} from "expo-router";
import "./globals.css"
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import {AuthProvider} from "@/components/AuthProvider";
import {useAuthStore} from "@/store/useAuthStore";
import {useEffect, useState} from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "@/assets/colors";

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();
    const {user} = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Start a loading process that checks authentication
        const checkAuthAndNavigate = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const isAuthScreen = segments[0] === "(auth)";
            const isSignedIn = user;
            
            if (!isSignedIn && !isAuthScreen) {
                router.replace("/(auth)");
            } else if (isSignedIn && isAuthScreen) {
                router.replace('/(tabs)');
            }
            
            // Loading complete
            setIsLoading(false);
        };
        
        checkAuthAndNavigate();
    }, [user, segments]);

    // Show loading screen while checking authentication
    if (isLoading) {
        return (
            <SafeAreaProvider>
                <SafeScreen>
                    <View style={styles.loadingContainer}>
                        <Image 
                            source={require("@/assets/images/cookingloading.png")} 
                            style={styles.loadingImage} 
                            resizeMode="contain"
                        />
                        <Text style={styles.loadingText}>Preparing your delicious experience...</Text>
                        <Text style={styles.waitText}>Please wait</Text>
                    </View>
                </SafeScreen>
                <StatusBar style="dark" />
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeScreen>
                <AuthProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="(auth)" />
                    </Stack>
                </AuthProvider>
            </SafeScreen>
            <StatusBar style="dark" />
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background || '#f7f7f7',
        padding: 20
    },
    loadingImage: {
        width: 250,
        height: 250,
        marginBottom: 20
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary || '#333',
        marginBottom: 8,
        textAlign: 'center'
    },
    waitText: {
        fontSize: 14,
        color: COLORS.textSecondary || '#666',
        fontStyle: 'italic'
    }
});