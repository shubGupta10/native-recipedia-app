import {StyleSheet, Text, View} from 'react-native'
import React, {useEffect} from 'react'
import {useLocalSearchParams} from "expo-router";
import {fetchRecipesBasedOnCategory} from "@/api/recipes";

const DisplayRecipieByCategory = () => {
    const {CategoryTitle} = useLocalSearchParams();

    useEffect(() => {
        const fetchByCategory = async () => {
            try {
                const result = await fetchRecipesBasedOnCategory(CategoryTitle as string);
                console.log(result);
            }catch (error){
                console.log(error);
            }
        }
        fetchByCategory();
    }, [CategoryTitle]);

    return (
        <View>
            <Text>[CategoryTitle: {CategoryTitle}</Text>
        </View>
    )
}
    export default DisplayRecipieByCategory
