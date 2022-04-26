import { useRoute } from "@react-navigation/native";
import { useTransitionProgress } from "react-native-screens";

const getMatchedUserInfo = (users, userLoggedIn) => {
    const newUsers = { ...users };
    delete newUsers[userLoggedIn.userId];

    const [id, user] = Object.entries(newUsers).flat();

    return { id, ...user };
};

export default getMatchedUserInfo;