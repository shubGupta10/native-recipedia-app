import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
    <View className="flex-1 bg-white">
      {/* Header Image */}
      <View className="h-1/3 w-full overflow-hidden">
        <Image
          source={{ uri: "https://storyset.com/illustration/chef/amico#C88468FF&hide=&hide=complete" }}
          placeholder='Register Image'
          contentFit="cover"
          className="w-full h-full"
          style={{ backgroundColor: COLORS.background }}
        />
      </View>

      {/* Content Container */}
      <View className="flex-1 px-6 pt-8 bg-white rounded-t-3xl -mt-8">
        <Text className="text-3xl font-bold mb-8" style={{ color: COLORS.textDark }}>
          Create Your Account
        </Text>
        
        {/* Name Input */}
        <View className="mb-5">
          <Text className="text-base mb-2 font-medium" style={{ color: COLORS.textPrimary }}>
            Name
          </Text>
          <TextInput
            placeholder='Enter your name'
            placeholderTextColor={COLORS.placeholderText}
            className="p-4 rounded-xl"
            style={{ backgroundColor: COLORS.inputBackground, borderColor: COLORS.border, borderWidth: 1 }}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email Input */}
        <View className="mb-5">
          <Text className="text-base mb-2 font-medium" style={{ color: COLORS.textPrimary }}>
            Email
          </Text>
          <TextInput
            placeholder='Enter your email'
            placeholderTextColor={COLORS.placeholderText}
            className="p-4 rounded-xl"
            style={{ backgroundColor: COLORS.inputBackground, borderColor: COLORS.border, borderWidth: 1 }}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View className="mb-8">
          <Text className="text-base mb-2 font-medium" style={{ color: COLORS.textPrimary }}>
            Password
          </Text>
          <TextInput
            placeholder='*******'
            placeholderTextColor={COLORS.placeholderText}
            className="p-4 rounded-xl"
            style={{ backgroundColor: COLORS.inputBackground, borderColor: COLORS.border, borderWidth: 1 }}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      
        {/* Create Account Button */}
        <TouchableOpacity 
          className="py-4 rounded-xl mt-4 items-center"
          style={{ backgroundColor: COLORS.primary }}
          onPress={handleCreateAccount}
        >
          <Text className="text-white font-bold text-lg">
            Create Account
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text style={{ color: COLORS.textSecondary }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Register