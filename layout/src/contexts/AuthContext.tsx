import { useEffect, useState, type ReactNode, createContext, useContext } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    photo: string | null;
}

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("@deskify:user");
        const token = localStorage.getItem("@deskify:token");

        if(savedUser && token) {
            setUser(JSON.parse(savedUser));
        }

        setIsLoading(false);
    }, []);

    function login(userData: User, token: string) {
        localStorage.setItem("@deskify:token", token);
        localStorage.setItem("@deskify:user", JSON.stringify(userData));
        setUser(userData);
    }

    function logout() {
        localStorage.removeItem("@deskify:token");
        localStorage.removeItem("@deskify:user");
        setUser(null);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");

    }

    return context;
}