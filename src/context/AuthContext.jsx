import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut, onAuthStateChanged, updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

//auth context creation
const AuthContext = createContext();

// custom hook to use auth context
export function useAuth() {
    return useContext(AuthContext);
}

//Authentication provider component
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, displayName) {
        try {
            //create a user account
            const result = await createUserWithEmailAndPassword
                (auth, email, password);

            await updateProfile(result.user, {
                displayName: displayName
            });

            //save additional user data in firestore
            await setDoc(doc(db, 'users', result.user.uid), {
                displayName: displayName,
                email: email,
                createdAt: new Date().toISOString()
            });

            return result;

        } catch (error) {
            console.error('register error:', error);
            throw error;
        }
    }

    function login(email, password) {
        return signInWithEmailAndPassword
            (auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    //listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {currentUser, signup, login, logout};

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}