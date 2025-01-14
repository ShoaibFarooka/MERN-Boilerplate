const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
    // Add your password validation logic here
    // For example, you might check for a minimum length or specific character requirements
    return password.length >= 8;
};

export { isValidEmail, isValidPassword };
