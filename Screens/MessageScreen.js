import { View, Text } from 'react-native'
import React from 'react'
import Header from "../components/Header"

const MessageScreen = () => {
    return (
        <View>
            <Header title="Chat" callEnabled />
            <Text>Message Screen</Text>
        </View>
    )
}

export default MessageScreen;