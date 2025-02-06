import Cookies from "js-cookie";

// Constants for cookie configuration
const TOKEN_KEY = "auth-token"; // Replace with the name you use for the token
const COOKIE_OPTIONS = {
  secure: true, // Ensures the cookie is only sent over HTTPS
  sameSite: "Strict" as "Strict" | "Lax" | "None", // Adjust based on your needs
  expires: 3, // Cookie expiration in days (adjust as necessary)
};


export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
};


export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};


export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY, { secure: true, sameSite: "Strict" }); // Same settings as used for setting the token
};

