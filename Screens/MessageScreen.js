import { View, Text, TextInput, KeyboardAvoidingView, Button, Touchable, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import React, { useState } from 'react';
import Header from "../components/Header";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import useAuth from "../hooks/useAuth";
import { useRoute } from "@react-navigation/native";
import tw from "twrnc";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import { addDoc } from "firebase/firestore";

const MessageScreen = () => {
    const { user } = useAuth();
    const { params } = useRoute();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const { matchDetails } = params;

    const sendMessage = () => {
        addDoc(collection)
    };

    return (
        <View
            style={tw`flex-1`}
        >
            <Header title={getMatchedUserInfo(matchDetails.users, user.uid).displayName} callEnabled />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <FlatList
                        data={messages}
                        style={tw`pl-4`}
                        keyExtractor={item => item.id}
                        renderItem={({ item: message }) => {
                            message.userId === user.uid ? (
                                <SenderMessage key={message.id} messages={message} />
                            ) : (
                                <ReceiverMessage key={message.id} messages={message} />
                            )
                        }}
                    />
                </TouchableWithoutFeedback>

                <View
                    style={tw`flex-row justify-between bg-white items-center border-t border-gray-200 px-5 py-2`}
                >

                    <TextInput
                        style={tw`h-10 text-lg`}
                        placeholder="Send Message..."
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                    />
                    <Button onPress={sendMessage} title="Send" color="#FF5864" />
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default MessageScreen;