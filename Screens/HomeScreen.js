import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { React, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native';
import tw from 'twrnc';
import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { collection, doc, getDoc, getDocs, getDocsFromCache, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const DUMMY_DATA = [
    {
        firstName: "Ezekiel",
        lastName: "Harvey",
        job: "Software Developer",
        photoUrl: "https://asisscientific.com.au/wp-content/uploads/2017/06/dummy-profile.jpg",
        age: 17,
        id: 123,
    },
    {
        firstName: "Ezekiel",
        lastName: "Harvey",
        job: "Doctor",
        photoUrl: "https://asisscientific.com.au/wp-content/uploads/2017/06/dummy-profile.jpg",
        age: 18,
        id: 456,
    },
    {
        firstName: "Ezekiel",
        lastName: "Harvey",
        job: "XR Developer",
        photoUrl: "https://asisscientific.com.au/wp-content/uploads/2017/06/dummy-profile.jpg",
        age: 19,
        id: 789,
    },
];


const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);

    useLayoutEffect(
        () =>
            onSnapshot(doc(db, 'user', user.uid), (snapshot) => {
                if (!snapshot.exists()) {
                    navigation.navigate('Modal');
                }
            }),
        []
    );

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {

            const passes = await getDocs(
                collection(db, 'user', user.uid, 'passes')).then(
                    (snapshot) => snapshot.docs.map((doc) => doc.id)
                );

            const swipes = await getDocs(
                collection(db, 'user', user.uid, 'swipes')
            ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

            const passedUserIds = passes.length > 0 ? passes : ['test'];
            const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

            unsub = onSnapshot(
                query(collection(db, 'user'), where('id', 'not-in', [...passedUserIds, ...swipedUserIds])), (snapshot) => {
                    setProfiles(
                        snapshot.docs
                            .filter((doc) => doc.id !== user.uid)
                            .map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }))
                    );
                }
            );
        };
        fetchCards();
        return unsub;
    }, [db]);

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log(`You swiped NOPE on ${userSwiped.displayName}`);

        setDoc(
            doc(db, 'user', user.uid, 'passes', userSwiped.id), userSwiped);
    };

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        const loggedInProfile = await (await getDoc(doc(db, "user", user.uid))).data();



        getDoc(doc(db, 'user', userSwiped.id, 'swipes', user.uid)).then(
            (documentSnapshot) => {
                if (documentSnapshot.exists()) {
                    console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`);

                    setDoc(
                        doc(db, 'user', user.uid, 'swipes', userSwiped.id), userSwiped
                    );

                    setDoc(doc(db, 'matched', generateId(user.uid, userSwiped.id)), {
                        users: {
                            [user.uid]: loggedInProfile,
                            [userSwiped.id]: userSwiped,
                        },
                        usersMatched: [user.uid, userSwiped.id],
                        timestamp: serverTimestamp(),
                    });

                    navigation.navigate('Match', {
                        loggedInProfile,
                        userSwiped,
                    });

                } else {
                    console.log(`You swiped on ${userSwiped.displayName} (${userSwiped.job})`
                    );
                    setDoc(
                        doc(db, 'user', user.uid, 'swipes', userSwiped.id), userSwiped
                    );
                }
            }
        );
    };

    console.log(profiles)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);
    return (
        <View style={tw`flex-1 mt-8`}>
            {/* Header */}
            <View style={tw`items-center relative`}>
                <TouchableOpacity style={tw`absolute left-5 top-3 rounded-full`} onPress={logout}>
                    <Image
                        style={tw`h-10 w-10 rounded-full`}
                        source={{ uri: user.photoURL }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Image style={tw`h-14 w-14`} source={require("../Images/tinder.png")} />
                </TouchableOpacity>

                <TouchableOpacity style={tw`absolute right-5 top-3`} onPress={() => navigation.navigate('Chat')}>
                    <Ionicons name='chatbubbles-sharp' size={30} color='#FF5864' />
                </TouchableOpacity>
            </View>
            {/* End of Header */}

            {/* Cards */}
            <View style={tw`flex-1 -mt-6`}>
                <Swiper
                    ref={swipeRef}
                    containerStyle={{ backgroundColor: "transparent" }}
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    disableBottomSwipe={true}
                    onSwipedLeft={(cardIndex) => {
                        console.log("Swipe NOPE");
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log("Swipe MATCH");
                        swipeRight(cardIndex);
                    }}
                    backgroundColor={"#4FD0E9"}
                    overlayLabels={{
                        left: {
                            title: "NOPE",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red",
                                },
                            },
                        },
                        right: {
                            title: "MATCH",
                            style: {
                                label: {
                                    color: "#4DED30",
                                },
                            },
                        },
                        top: {
                            title: 'SUPER LIKE',
                            style: {
                                label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                            },
                        },

                    }}
                    renderCard={(card) => card ? (
                        <View key={card.id} style={tw`relative bg-white h-3/4 rounded-xl`}>
                            <Image
                                style={tw`absolute top-0 h-full w-full rounded-xl`}
                                source={{ uri: card.photoURL }}
                            />

                            <View style={[tw`absolute bottom-0 bg-white w-full flex-row justify-between
                             items-center h-20 px-6 py-2 rounded-b-xl shadow-xl`, /*styles.cardShadow,*/]}>
                                <View>
                                    <Text style={tw`text-xl font-bold`}>
                                        {card.firstName} {card.lastName}
                                    </Text>
                                    <Text>{card.job}</Text>
                                </View>
                                <Text style={tw`text-2xl font-bold`}>{card.age}</Text>
                            </View>
                        </View>
                    ) : (
                        <View
                            style={[
                                tw`relative bg-white h-3/4 rounded-xl justify-center items-center`,
                                styles.cardShadow,
                            ]}
                        >
                            <Text style={tw`font-bold pb-5`}>No more Profiles</Text>

                            <Image
                                style={tw`h-20 w-20`}
                                height={100}
                                width={100}
                                source={{ uri: "https://links.papareact.com/6gb" }}
                            />

                        </View>
                    )}
                />
            </View>
            <View style={tw`flex flex-row justify-evenly mb-10`}>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeLeft()}
                    style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}>
                    <Entypo name="cross" size={30} color="red" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeTop()}
                    style={tw`items-center justify-center rounded-full w-16 h-16 bg-blue-200`}>
                    <Ionicons name="star" size={26} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()}
                    style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}>
                    <AntDesign name="heart" size={24} color="green" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
});