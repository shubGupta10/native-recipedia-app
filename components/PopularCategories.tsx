import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { COLORS } from '@/assets/colors';
import { Animated } from 'react-native';
import { useRouter } from 'expo-router';

const ScrollView = Animated.ScrollView;

const categories = [
    {
        id: '1',
        title: 'Breakfast',
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '2',
        title: 'Lunch',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '3',
        title: 'Dinner',
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '4',
        title: 'Dessert',
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '5',
        title: 'Snacks',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
];

const PopularCategories = () => {
    const router = useRouter();

    return (
        <View className="flex-col p-5">
            <Text
                style={{
                    fontSize: 18,
                    fontWeight: '700',
                    marginBottom: 8,
                    color: COLORS.textPrimary,
                }}
            >
                Categories
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-3 mt-2">
                {categories.map((cat) => (
                    <Pressable
                        key={cat.id}
                        onPress={() =>
                            router.push({
                                pathname: '/(screen)/DisplayRecipieByCategory/[CategoryTitle]',
                                params: { CategoryTitle: cat.title },
                            })
                        }
                        style={{
                            backgroundColor: COLORS.cardBackground,
                            padding: 16,
                            borderRadius: 12,
                            alignItems: 'center',
                            marginRight: 12,
                        }}
                    >
                        <Image
                            source={{ uri: cat.image }}
                            style={{ width: 80, height: 80, borderRadius: 8 }}
                            contentFit="cover"
                            transition={300}
                        />
                        <Text style={{ marginTop: 4, fontSize: 14, color: COLORS.textPrimary }}>
                            {cat.title}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
};

export default PopularCategories;
