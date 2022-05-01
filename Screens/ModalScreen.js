import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import tw from "twrnc";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import UploadImage from "../components/UploadImage"

const ModalScreen = () => {
    const { user } = useAuth();
    const [image, setImage] = useState(null);
    const [job, setJob] = useState(null);
    const [age, setAge] = useState(null);
    const navigation = useNavigation();

    const incompleteForm = !job || !age;

    const updateUserProfile = () => {
        setDoc(doc(db, 'user', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp(),
        }).then(() => {
            navigation.navigate('Home');
        }).catch((error) => {
            alert(error.message);
        });
    };

    return (
        <View style={tw`flex-1 items-center pt-5`}>
            <Image
                style={tw`h-20 w-full`}
                resizeMode="contain"
                source={{ uri: "https://links.papareact.com/2pf" }}
            />

            <Text style={tw`text-xl text-gray-500 p-2 font-bold`}>
                Welcome {user.displayName}
            </Text>

            <Text style={tw`text-center p-4 front-bold text-red-400`}>
                Step 1: The Profile Pic
            </Text>

            <UploadImage
                value={image}
                onChange={setImage}
            />

            <Text style={tw`text-center p-4 front-bold text-red-400`}>
                Step 2: The Job
            </Text>

            <TextInput
                value={job}
                onChangeText={setJob}
                style={tw`text-center text-xl pb-2`}
                placeholder="Enter Your Occupation"
            />

            <Text style={tw`text-center p-4 front-bold text-red-400`}>
                Step 3: The Age
            </Text>

            <TextInput
                value={age}
                onChangeText={setAge}
                style={tw`text-center text-xl pb-2`}
                placeholder="Enter Your Age"
                keyboardType="numeric"
                maxLength={2}
            />

            <TouchableOpacity
                disabled={incompleteForm}
                style={[tw`w-64 p-3 rounded-xl absolute bottom-10 bg-red-400`,
                incompleteForm ? tw`bg-gray-400` : tw`bg-red-400`
                ]}
                onPress={updateUserProfile}
            >
                <Text style={tw`text-center text-white text-xl`}>Update Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ModalScreen;