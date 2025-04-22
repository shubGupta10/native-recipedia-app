import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth"
import { auth } from "./firebaseClient"
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL!

export const registerUser = async (name: string, email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(userCredential.user, {
            displayName: name,
        })
        console.log("User registered:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
}

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    }catch (error){
        console.error("Login error:", error);
        throw error;
    }
}

export const GenerateRecipes = async (ingredients: string[]) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/generate-recipe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ingredients })
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error while calling generate-recipe API:", error);
        throw error;
    }
};
