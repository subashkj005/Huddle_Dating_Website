export function isPasswordStrongEnough(password) {

    const SPECIAL_CHARACTERS = "!@#$%^&*()_=<>?";
  
    if (password.length < 8) {
      return { strongEnough: false, message: "Password must be at least 8 characters long." };
    }
  
    if (!/[A-Z]/.test(password)) {
      return { strongEnough: false, message: "Password must contain at least one uppercase letter." };
    }
  
    if (!/[a-z]/.test(password)) {
      return { strongEnough: false, message: "Password must contain at least one lowercase letter." };
    }
  
    if (!/\d/.test(password)) {
      return { strongEnough: false, message: "Password must contain at least one digit." };
    }
  
    if (!new RegExp(`[${SPECIAL_CHARACTERS}]`).test(password)) {
      return { strongEnough: false, message: "Password must contain at least one special character." };
    }
  
    return { strongEnough: true, message: "Password is strong enough." };
  }

