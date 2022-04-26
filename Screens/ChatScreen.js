import { View, Text } from 'react-native';
import React from 'react';
import Header from "../components/Header";
import ChatList from "../components/ChatList";

const ChatScreen = () => {
    return (
        <View>
            <Header title="Chat" />
            <ChatList />
        </View>
    );
};

export default ChatScreen;