import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, updateProfile} from "firebase/auth"
import {auth, db} from "./firebaseClient"
import {collection, doc, getDoc, getDocs, setDoc, updateDoc} from "@firebase/firestore";
import {generateRandomId} from "@/utility/GenerateRandomId";

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

export const updateUserProfile = async (name: string, bio: string, email: string) => {
    try {
      const currentUser = auth.currentUser;
  
      if (!currentUser) {
        throw new Error("No authenticated user.");
      }
  
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }
  
      await updateProfile(currentUser, {
        displayName: name,
        photoURL: bio, 
      });
  
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

export const GenerateRecipes = async (ingredients: string[]) => {
    try {
        const res = await fetch(`${BACKEND_URL}/api/generate-recipe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ingredients }),
        });

        if (!res.ok) {
            throw new Error("Failed to generate recipe");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error generating recipe from API:", error);
        throw error;
    }
};

export const saveRecipeToFirestore = async (userId: string, recipeData: any) => {
    try {
        const recipeId = generateRandomId();

        const recipeDocRef = doc(db, "Recipes", userId, "UserRecipes", recipeId);

        const fullRecipeData = {
            ...recipeData,
            recipeId,
            createdAt: new Date().toISOString(),
        };

        await setDoc(recipeDocRef, fullRecipeData);

        return fullRecipeData;
    } catch (error) {
        console.error("Error saving recipe to Firestore:", error);
        throw error;
    }
};

export const fetchSavedRecipe = async (userId: string) => {
    try {
        const recipeCollectionRef = collection(db, "Recipes", userId, "UserRecipes");
        const snapshot = await getDocs(recipeCollectionRef);

        const savedRecipes = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const { recipeId, name } = data;
            return { recipeId, name };
        });

        return savedRecipes;
    } catch (error) {
        console.error("Error fetching saved recipes:", error);
        return [];
    }
};

export const getRecipeById = async (userId: string, recipeId: string) => {
    try {
        const recipeDocRef = doc(db, "Recipes", userId, "UserRecipes", recipeId);
        const docSnap = await getDoc(recipeDocRef);

        if (!docSnap.exists()) {
            throw new Error("Recipe not found");
        }

        return docSnap.data();
    } catch (error) {
        console.error("Error fetching recipe by ID:", error);
        throw error;
    }
};