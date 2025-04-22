'use client'

import {onAuthStateChanged} from "@firebase/auth";
import {auth} from '@/firebase/firebaseClient'
import {ReactNode, useEffect} from "react";
import {useAuthStore} from "@/store/useAuthStore";

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const setUser = useAuthStore((s) => s.setUser);
    const setLoading = useAuthStore((s) => s.setLoading);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setLoading(false)
        })
        return () => unsubscribe();
    }, [setLoading, setUser]);
    return children;
}