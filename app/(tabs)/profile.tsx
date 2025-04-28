import React from 'react';
import {Text, View, TouchableOpacity, ScrollView, Image, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from "@/store/useAuthStore";
import {COLORS} from "@/assets/colors";
import {getAuth, signOut} from "firebase/auth";
import { router } from 'expo-router';

const Profile = () => {
    const { user } = useAuthStore();

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            Alert.alert("User logged out");
        }catch (error: any){
            console.log(error);
            Alert.alert(error.message);
        }
    };

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center p-4" style={{ backgroundColor: COLORS.background }}>
                <Text className="text-lg" style={{ color: COLORS.textDark }}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1" style={{ backgroundColor: COLORS.background }}>
            {/* Header */}
            <View className="items-center pt-8 pb-6">
                {user.photoURL ? (
                    <Image
                        source={{ uri: user.photoURL }}
                        className="w-24 h-24 rounded-full mb-4"
                    />
                ) : (
                    <View className="w-24 h-24 rounded-full mb-4 items-center justify-center" style={{ backgroundColor: COLORS.primary }}>
                        <Text className="text-3xl font-bold" style={{ color: COLORS.white }}>
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                )}

                <Text className="text-2xl font-bold mb-1" style={{ color: COLORS.textDark }}>
                    {user.displayName || 'User'}
                </Text>
                <Text className="text-sm" style={{ color: COLORS.textSecondary }}>
                    {user.email}
                </Text>
            </View>

            {/* Profile Details */}
            <View className="px-4 py-6">
                <Text className="text-lg font-semibold mb-4" style={{ color: COLORS.textPrimary }}>Account Information</Text>

                <View className="mb-4">
                    <ProfileDetailItem
                        icon="person-outline"
                        label="User ID"
                        value={user.uid}
                    />

                    <ProfileDetailItem
                        icon="mail-outline"
                        label="Email"
                        value={user.email || 'Not provided'}
                    />

                    <ProfileDetailItem
                        icon="call-outline"
                        label="Phone"
                        value={user.phoneNumber || 'Not provided'}
                    />

                    <ProfileDetailItem
                        icon="checkmark-circle-outline"
                        label="Email Verified"
                        value={user.emailVerified ? 'Yes' : 'No'}
                    />

                    <ProfileDetailItem
                        icon="time-outline"
                        label="Account Created"
                        value={user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                    />
                </View>
            </View>

            {/* Logout Button */}
            <View className="p-4 flex-row justify-center gap-4">
                <TouchableOpacity
                    onPress={() => {
                        router.push({
                            pathname: "/(screen)/(user)/[id]",
                            params: {id: user.uid}
                        })
                    }}
                    className="flex-row items-center justify-center py-3 px-8 rounded-full my-4"
                    style={{ backgroundColor: COLORS.primary }}
                >
                    <Ionicons name="person-circle" size={20} color={COLORS.white} />
                    <Text className="text-base font-medium ml-2" style={{ color: COLORS.white }}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center justify-center py-3 px-8 rounded-full my-4"
                    style={{ backgroundColor: COLORS.primary }}
                >
                    <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
                    <Text className="text-base font-medium ml-2" style={{ color: COLORS.white }}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// Helper component for profile details
const ProfileDetailItem = ({ icon, label, value }: {icon: any, label: string, value: string}) => (
    <View className="flex-row items-center py-3 border-b" style={{ borderBottomColor: COLORS.border }}>
        <View className="w-10">
            <Ionicons name={icon} size={20} color={COLORS.primary} />
        </View>
        <View className="flex-1">
            <Text className="text-sm" style={{ color: COLORS.textSecondary }}>{label}</Text>
            <Text className="text-base" style={{ color: COLORS.textDark }}>{value}</Text>
        </View>
    </View>
);

export default Profile;