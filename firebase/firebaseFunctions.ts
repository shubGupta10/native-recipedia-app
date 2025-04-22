import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth"
import { auth } from "./firebaseClient"

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