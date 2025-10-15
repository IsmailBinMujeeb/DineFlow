import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')

    return (
        <AuthContext.Provider value={{ email, setEmail, role, setRole }}>
            {children}
        </AuthContext.Provider>
    )
}