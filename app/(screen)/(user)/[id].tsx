import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '@/assets/colors';
import { updateUserProfile } from '@/firebase/firebaseFunctions';

function EditUserProfile() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
  });

  // Update user data handler
  const handleUpdateUser = async () => {

    try {
      setIsSaving(true);
      await updateUserProfile(name, bio, email);
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: COLORS.background }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center pt-12 pb-4 px-4" style={{ backgroundColor: COLORS.background }}>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 mr-4 rounded-full"
            style={{ backgroundColor: COLORS.white }}
          >
            <AntDesign name="arrowleft" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text className="text-xl font-bold flex-1" style={{ color: COLORS.textDark }}>Edit Profile</Text>
        </View>

        {/* Form Fields */}
        <View className="px-4 py-6">
          {/* Name Field */}
          <View className="mb-4">
            <Text className="mb-2 font-medium" style={{ color: COLORS.textDark }}>Name</Text>
            <View className="flex-row items-center rounded-lg px-3 py-2" style={{ backgroundColor: COLORS.inputBackground }}>
              <MaterialIcons name="person" size={20} color={COLORS.textSecondary} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor={COLORS.placeholderText}
                className="flex-1 ml-2 text-base"
                style={{ color: COLORS.textPrimary }}
              />
            </View>
            {errors.name ? <Text className="mt-1 text-xs text-red-500">{errors.name}</Text> : null}
          </View>

          {/* Email Field */}
          <View className="mb-4">
            <Text className="mb-2 font-medium" style={{ color: COLORS.textDark }}>Email</Text>
            <View className="flex-row items-center rounded-lg px-3 py-2" style={{ backgroundColor: COLORS.inputBackground }}>
              <MaterialIcons name="email" size={20} color={COLORS.textSecondary} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor={COLORS.placeholderText}
                className="flex-1 ml-2 text-base"
                style={{ color: COLORS.textPrimary }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email ? <Text className="mt-1 text-xs text-red-500">{errors.email}</Text> : null}
          </View>

          {/* Bio Field */}
          <View className="mb-6">
            <Text className="mb-2 font-medium" style={{ color: COLORS.textDark }}>Bio</Text>
            <View className="rounded-lg px-3 py-2" style={{ backgroundColor: COLORS.inputBackground }}>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor={COLORS.placeholderText}
                className="text-base"
                style={{ color: COLORS.textPrimary }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleUpdateUser}
            disabled={isSaving}
            className="py-3 rounded-lg items-center"
            style={{ backgroundColor: COLORS.primary }}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text className="text-white font-semibold text-base">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default EditUserProfile;