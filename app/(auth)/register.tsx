import {Alert, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import { COLORS } from '@/assets/colors'
import { useRouter } from 'expo-router';
import { registerUser } from '@/firebase/firebaseFunctions';

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();

  const handleCreateAccount = async () => {
    try {
      const user = await registerUser(name, email, password);  
      Alert.alert("Account created Successfully")
    } catch (error) {
      console.error("Failed to register user", error)
    }
  }

  return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header Image */}
        <View style={{ height: '65%', width: '100%', overflow: 'hidden' }}>
          <Image
              source={require('@/assets/images/loginImage.png')}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                backgroundColor: COLORS.background,
              }}
          />
        </View>

        {/* Content Container */}
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 30, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
          <Text className="text-3xl font-bold mb-8" style={{ color: COLORS.textDark }}>
            Create Your Account
          </Text>

          {/* Name Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500', color: COLORS.textPrimary }}>Name</Text>
            <TextInput
                placeholder="Enter your name"
                placeholderTextColor={COLORS.placeholderText}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: COLORS.inputBackground,
                  borderColor: COLORS.border,
                  borderWidth: 1,
                }}
                value={name}
                onChangeText={setName}
            />
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500', color: COLORS.textPrimary }}>Email</Text>
            <TextInput
                placeholder="Enter your email"
                placeholderTextColor={COLORS.placeholderText}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: COLORS.inputBackground,
                  borderColor: COLORS.border,
                  borderWidth: 1,
                }}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 16, marginBottom: 8, fontWeight: '500', color: COLORS.textPrimary }}>Password</Text>
            <TextInput
                placeholder="*******"
                placeholderTextColor={COLORS.placeholderText}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: COLORS.inputBackground,
                  borderColor: COLORS.border,
                  borderWidth: 1,
                }}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
              style={{
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: COLORS.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleCreateAccount}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Create Account</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
            <Text style={{ color: COLORS.textSecondary }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
  );
}

export default Register