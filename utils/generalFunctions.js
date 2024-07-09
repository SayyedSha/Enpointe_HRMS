import userModel from "../models/user.model.js";

export function generatePassword() {
    const length = 8; // minimum length of the password
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    
    // Ensure at least one uppercase letter, one number, and one special character
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*";
    
    // Add one random character from each required set to the password
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Fill the remaining characters with random selections from the charset
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password to ensure random distribution of characters
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    return password;
  }
  

  export const generateAccess = async (userId) => {
    try {
      const user = await userModel.findById(userId);
      const accessToken = user.generateAccessToken();
      return {
        success:true,
        accessToken
      };
    } catch (error) {
        console.error(error)
      return {
        success: false,
        message:
          "Something went wrong while generating referesh and access token",
      };
    }
  };