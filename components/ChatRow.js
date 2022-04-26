import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation();
    const { user } = useAuth();

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid))
    }, [matchDetails, user])

    return (
        <TouchableOpacity>
            <Image

            />
        </TouchableOpacity>
    );
};

export default ChatRow;