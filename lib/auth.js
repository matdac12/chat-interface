// Authentication utilities for chat application

// Hardcoded authorized users with profile information
const AUTHORIZED_USERS = {
  "mattia.dacampo@gmail.com": {
    password: "leonardo",
    name: "Mattia",
    lastname: "Da Campo",
  },
  // Add more users here as needed
  // Example:
  // "email@example.com": {
  //   password: "password123",
  //   name: "FirstName",
  //   lastname: "LastName",
  // },
};

const SESSION_KEY = "chat_auth_session";

/**
 * Validate user credentials against authorized users list
 * @param {string} email
 * @param {string} password
 * @returns {boolean}
 */
export function validateCredentials(email, password) {
  const user = AUTHORIZED_USERS[email];
  return user && user.password === password;
}

/**
 * Get user profile data by email
 * @param {string} email
 * @returns {object|null}
 */
export function getUserProfile(email) {
  const user = AUTHORIZED_USERS[email];
  if (!user) return null;

  // Return user data without password
  return {
    email,
    name: user.name,
    lastname: user.lastname,
  };
}

/**
 * Create a session and store it in localStorage
 * @param {string} email
 * @param {boolean} rememberMe
 */
export function createSession(email, rememberMe = false) {
  const userProfile = getUserProfile(email);

  const session = {
    isAuthenticated: true,
    email,
    name: userProfile.name,
    lastname: userProfile.lastname,
    loginTime: new Date().toISOString(),
    rememberMe,
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to store session:", error);
  }
}

/**
 * Get the current session from localStorage
 * @returns {object|null}
 */
export function getSession() {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const session = JSON.parse(sessionData);

    // Check if session is valid
    if (session.isAuthenticated && session.email) {
      return session;
    }

    return null;
  } catch (error) {
    console.error("Failed to read session:", error);
    return null;
  }
}

/**
 * Check if user is currently authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  const session = getSession();
  return session !== null && session.isAuthenticated === true;
}

/**
 * Clear the session and log out the user
 */
export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear session:", error);
  }
}

/**
 * Get the current user's email
 * @returns {string|null}
 */
export function getCurrentUser() {
  const session = getSession();
  return session ? session.email : null;
}
