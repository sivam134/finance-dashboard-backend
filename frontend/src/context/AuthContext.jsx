import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registeredUsers, setRegisteredUsers] = useState([]);

    useEffect(() => {
        // Load registered users from localStorage
        const storedRegisteredUsers = localStorage.getItem('registeredUsers');
        if (storedRegisteredUsers) {
            setRegisteredUsers(JSON.parse(storedRegisteredUsers));
        }

        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in with Firebase
                const userData = {
                    username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                    email: firebaseUser.email,
                    role: 'user',
                    token: firebaseUser.accessToken,
                    avatar: firebaseUser.photoURL,
                    provider: 'google'
                };
                setUser(userData);
            } else {
                // Check for local storage user (for username/password login)
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = (username, email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const existingUser = registeredUsers.find(u => u.username === username || u.email === email);
                if (existingUser) {
                    reject(new Error('User already exists'));
                    return;
                }

                const newUser = { username, email, password, role: 'user' };
                const updatedUsers = [...registeredUsers, newUser];
                setRegisteredUsers(updatedUsers);
                localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
                resolve(newUser);
            }, 1000);
        });
    };

    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username === 'admin' && password === 'password') {
                    const mockUser = { username: 'admin', role: 'admin', token: 'mock-jwt-token-admin' };
                    setUser(mockUser);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                    resolve(mockUser);
                    return;
                }

                // Get fresh registered users from localStorage
                const storedUsers = localStorage.getItem('registeredUsers');
                const currentRegisteredUsers = storedUsers ? JSON.parse(storedUsers) : [];

                const registeredUser = currentRegisteredUsers.find(
                    u => u.username === username && u.password === password
                );

                if (registeredUser) {
                    const mockUser = {
                        username: registeredUser.username,
                        email: registeredUser.email,
                        role: registeredUser.role,
                        token: `mock-jwt-token-${registeredUser.username}`
                    };
                    setUser(mockUser);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            // Force account selection every time
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            const result = await signInWithPopup(auth, provider);
            return result.user;
        } catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    };

    const loginWithOAuth = (provider, account = null) => {
        // For GitHub (mock) - keep existing behavior
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    username: account ? account.name : `${provider}_user`,
                    email: account ? account.email : `user@${provider}.com`,
                    role: 'user',
                    token: `mock-oauth-token-${provider}`,
                    avatar: account ? account.avatar : null
                };
                setUser(mockUser);
                localStorage.setItem('user', JSON.stringify(mockUser));
                resolve(mockUser);
            }, 1000);
        });
    };

    const logout = async () => {
        try {
            // Sign out from Firebase if user is signed in with Firebase
            if (auth.currentUser) {
                await firebaseSignOut(auth);
            }
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, loginWithOAuth, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
