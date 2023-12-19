export const validateFormData = (formData, flag = false) => {
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!formData.email || !emailRegex.test(formData.email)) {
    return "Please enter a valid email address";
  }

  // edge case handling when we don't want to update password in profile page
  if (flag && formData.password === undefined) return null;

  // Password validation
  if (!formData.password || formData.password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  return null;
};

export const getErrorMessage = (error) => {
  if (error.includes("E11000 duplicate key error")) {
    if (/username/.test(error)) {
      return "Username is already taken. Please choose a different one!";
    } else {
      return "Email already exists!";
    }
  }
  return error;
};
