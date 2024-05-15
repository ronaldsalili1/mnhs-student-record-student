export const getAuthenticated = () => {
    return localStorage.getItem('student_authenticated');
};

export const setAuthenticated = () => {
    localStorage.setItem('student_authenticated', 'yes');
};

export const removeAuthenticated = () => {
    localStorage.removeItem('student_authenticated');
};