import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut, onAuthStateChanged, updateProfile,
    sendEmailVerification, sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { USER_TYPES } from "../utils/constants";

//auth context creation
const AuthContext = createContext();

// custom hook to use auth context
export function useAuth() {
    return useContext(AuthContext);
}

//Authentication provider component
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
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

    async function sendVerification() {
        if (currentUser && !currentUser.emailVerified) {
            await sendEmailVerification(currentUser);
        }
    }

    function resetPassword(email) {
        sendPasswordResetEmail(auth, email);
    }

    //listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = { currentUser, signup, login, logout };

    async function signupCompany(email, password, companyData) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, {
                displayName: companyData.companyName
            });

            const profileData = {
                ...companyData,
                userType: USER_TYPES.COMPANY,
                email: email,
                uid: result.user.uid,
                createdAt: new Date().toISOString,
                updatedAt: new Date().toISOString,
                isVerified: false
            }

            await setDoc(doc(db, 'users', result.user.uid), profileData);
            await setDoc(doc(db, 'companies', result.user.uid), profileData);
            setUserProfile(profileData);
        } catch (error) {
            throw error;
        }
    }

    async function fetchUserProfile(uid) {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const profileData = userDoc.data();
                setUserProfile(profileData);
                return profileData;
            }
        } catch (error) {
            console.error('Error fetching user profile: ', error);
        }
        return null;
    }

    async function updateUserProfile(updates) {
        try {
            if (!currentUser) throw new Error('no user logged in');

            const updateData = {
                ...updates,
                updatedAt: new Date().toISOString()
            }

            await setDoc(doc(db, 'users', currentUser.uid), updateData, { merge: true });

            if (updateProfile?.userType === USER_TYPES.COMPANY) {
                await setDoc(doc(db, 'companies', currentUser.uid), updateData, { merge: true });
            }
            setUserProfile(prev => ({ ...prev, ...updateData }));
            return true;
        } catch (error) {
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}