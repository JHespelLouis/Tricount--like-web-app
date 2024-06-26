import React, {createContext, useContext, useState, useEffect} from 'react';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {getFirestore, doc, getDoc} from "firebase/firestore";
import {useNavigate, useLocation} from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const db = getFirestore();
                const docRef = doc(db, "users", firebaseUser.uid);

                getDoc(docRef).then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = {
                            uid: firebaseUser.uid,
                            userName: docSnapshot.data().firstname,
                        };
                        setUser(userData);
                    } else {
                        console.error("No such document!");
                        setUser(null);
                    }
                }).catch((error) => {
                    console.error("Error getting document:", error);
                    setUser(null);
                });
            } else if (location.pathname !== '/Register') {
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <AuthContext.Provider value={user}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
