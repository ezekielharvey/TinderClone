import React from 'react';
import { createContext, useContext } from 'react';
import * as Google from 'expo-google-app-auth';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from '@firebase/auth';
import { auth } from '../firebase';
import { useState, useEffect, useMemo } from 'react';

const AuthContext = createContext({});

const config = {
    androidClientId: '1019193433856-qhtaf2qtqt6297fvp8g37vpmfs7etpp7.apps.googleusercontent.com',
    iosClientId: '1019193433856-kth05lj3fqigdqf98f78bcb9s7ieishg.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    permissions: ["public_profile", "email", "gender", "location"],
}


export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(
        () =>
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    //Logged in
                    setUser(user);
                } else {
                    // Not logged in
                    setUser(null);
                }

                setLoadingInitial(false);
            }),
        []
    );

    const logout = async () => {
        setLoading(true);

        signOut(auth)
            .catch((error) => setError(error))
            .finally(() => setLoading(false));

    }

    const signInWithGoogle = async () => {
        setLoading(true);

        await Google.logInAsync(config).then(async (logInResult) => {
            if (logInResult.type === 'success') {
                // login...
                const { idToken, accessToken } = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);

                await signInWithCredential(auth, credential)
            }

            return Promise.reject();
        })
            .catch(error => setError(error))
            .finally[() => setLoading(false)];
    };

    const memoedValue = useMemo(() => ({
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
    }), [user, loading, error])

    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    )
};

export default function useAuth() {
    return useContext(AuthContext);
}