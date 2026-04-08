import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (role, id) => {
        setCurrentUser({ role, id });
    };

    const logout = () => { setCurrentUser(null) };
    
    return (
        <AuthContext.Provider value={{currentUser, setCurrentUser, login, logout, }}>
            {children}
        </AuthContext.Provider>
    )
}