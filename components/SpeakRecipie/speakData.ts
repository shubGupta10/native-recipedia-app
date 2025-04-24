import * as Speech from 'expo-speech'

export const SpeakTheRecipe = async (data: any) => {
    Speech.speak(data, {
        language: 'en-US',
        rate: 1.0
    });
};