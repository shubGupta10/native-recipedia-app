import React from 'react'
import {Tabs} from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import {COLORS} from "@/assets/colors";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const TabLayout = () => {
    const insight = useSafeAreaInsets();

    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            headerTitleStyle: {
                color: COLORS.textPrimary,
                fontWeight: "600",
            },
            headerShadowVisible: false,
            tabBarStyle: {
                backgroundColor: COLORS.background,
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
                paddingTop: 5,
                paddingBottom: insight.bottom,
                height: 60 + insight.bottom,
            }
        }}

        >
            <Tabs.Screen name="index" options={{
                title: "Home",
                tabBarIcon: ({color, size}) => (
                    <Ionicons name='home-outline' size={size} color={color} />
                )
            }} />
            <Tabs.Screen name="search"
            options={{
                title: "Search",
                tabBarIcon: ({color, size}) => (
                    <Ionicons name='search-outline' size={size} color={color} />
                )
            }}
            />

            <Tabs.Screen name="profile"
            options={{
                title: "Profile",
                tabBarIcon: ({color, size}) => (
                    <Ionicons name='person-outline' size={size} color={color} />
                )
            }}
            />
        </Tabs>
    )
}
export default TabLayout
