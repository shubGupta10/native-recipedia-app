import {Stack, useRouter, useSegments} from "expo-router";
import "./globals.css"
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import {AuthProvider} from "@/components/AuthProvider";
import {useAuthStore} from "@/store/useAuthStore";
import {useEffect} from "react";

export default function RootLayout() {
    const router = useRouter();
    const segments = useSegments();

    const {user} = useAuthStore();

    useEffect(() => {
        const isAuthScreen = segments[0] === "(auth)";
        const isSignedIn = user;
        if(!isSignedIn && !isAuthScreen) router.replace("/(auth)");
        else if(isSignedIn && isAuthScreen) router.replace('/(tabs)')
    }, [user, segments]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
          <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
          </AuthProvider>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  )
}
