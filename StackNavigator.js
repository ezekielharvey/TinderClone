import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Text, View } from 'react-native'
import HomeScreen from './Screens/HomeScreen'
import ChatScreen from './Screens/ChatScreen'

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Chat' component={ChatScreen} />
        </Stack.Navigator>
    );
};

export default StackNavigator;

