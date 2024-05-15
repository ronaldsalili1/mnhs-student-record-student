import { createContext, useEffect } from 'react';

import useAuth from '../hooks/useAuth';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const { student, activeSemester, checkAuthStatus, setStudent } = useAuth();

    useEffect(() => {
        checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider
            value={{ student, activeSemester, setStudent }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;