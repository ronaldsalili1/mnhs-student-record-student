import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { get } from '../helpers/request';

const useAuth = () => {
    const [checkingAuthStatus, setCheckingAuthStatus] = useState(false);
    const [meta, setMeta] = useState(null);
    const [student, setStudent] = useState(null);
    const [activeSemester, setActiveSemester] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const resetMeta = () => {
        setMeta(null);
    };

    const checkAuthStatus = async () => {
        setCheckingAuthStatus(true);

        const response = await get({ uri: '/student/auth/authenticated', navigate, location });
        if (response?.meta?.code !== 200) {
            navigate(`/login?path=${location.pathname + location.search + location.hash}`, { replace: true });
            return;
        }

        setStudent(response?.data?.student);
        setActiveSemester(response?.data?.semester);
        setCheckingAuthStatus(false);
    };

    return {
        checkingAuthStatus,
        meta,
        student,
        setStudent,
        resetMeta,
        checkAuthStatus,
        activeSemester,
    };
};

export default useAuth;