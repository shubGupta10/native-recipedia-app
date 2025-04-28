import {Alert, Text, TextInput, TouchableOpacity, View, Image, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS } from '@/assets/colors';
import { useRouter } from 'expo-router';
import { registerUser } from '@/firebase/firebaseFunctions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeScreen from '@/components/SafeScreen';
import { StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking authentication state
    const checkAuth = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Set up keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );
    
    return () => {
      clearTimeout(checkAuth);
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleCreateAccount = async () => {
    try {
      setIsLoading(true);
      const user = await registerUser(name, email, password);  
      Alert.alert("Account created Successfully");
    } catch (error) {
      console.error("Failed to register user", error);
      Alert.alert("Registration Failed", "Please check your information and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

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
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Header Image */}
            <View style={[
              styles.imageContainer, 
              keyboardVisible && Platform.OS === "ios" ? { height: 100 } : null
            ]}>
              <Image
                source={require('@/assets/images/registerImage.png')}
                style={styles.headerImage}
              />
            </View>

            {/* Content Container */}
            <View style={styles.formContainer}>
              <Text style={styles.headerText}>
                Create Your Account
              </Text>

              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Name</Text>
                <TextInput
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.placeholderText}
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Email</Text>
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.placeholderText}
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Password</Text>
                <TextInput
                  placeholder="*******"
                  placeholderTextColor={COLORS.placeholderText}
                  style={styles.input}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Create Account Button */}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleCreateAccount}
              >
                <Text style={styles.registerButtonText}>Create Account</Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={{ color: COLORS.textSecondary }}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/")}>
                  <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: '35%',
    maxHeight: 250,
    width: '100%',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover', 
    backgroundColor: COLORS.background
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: COLORS.textDark
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: COLORS.textPrimary
  },
  input: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    fontSize: 16,
  },
  registerButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginBottom: 8,
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    paddingBottom: 16,
  },
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