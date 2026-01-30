// import React, { createContext, useState, useContext, useEffect } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Initialize from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (err) {
//         console.error("Failed to parse stored user:", err);
//         localStorage.removeItem("user");
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     setError(null);
//     setLoading(true);
//     try {
//       // Simulate API call - replace with actual backend call
//       // For demo: accept any email/password combination
//       if (!email || !password) {
//         throw new Error("Email and password are required");
//       }

//       // Simulate API delay
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       const userData = {
//         id: Math.random().toString(36).substr(2, 9),
//         email,
//         name: email.split("@")[0],
//         role: "data_steward",
//         loginTime: new Date().toISOString(),
//       };

//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//       return { success: true };
//     } catch (err) {
//       const message = err.message || "Login failed";
//       setError(message);
//       return { success: false, error: message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setError(null);
//     localStorage.removeItem("user");
//   };

//   const isAuthenticated = !!user;

//   const value = {
//     user,
//     isAuthenticated,
//     login,
//     logout,
//     loading,
//     error,
//     setError,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// // eslint-disable-next-line react-refresh/only-export-components
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }






















// NEW CODE:-
// NEW CODE:-
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// We keep this internal to the file to satisfy the "only export components" rule
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Session restore failed", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      // Use the correct API endpoint from mock server
      const response = await axios.get("http://localhost:3000/api/v1/users");
      // Handle both array response and object response with 'users' key
      const users = Array.isArray(response.data)
        ? response.data
        : response.data.users || [];

      console.log('API Response:', response.data);
      console.log('Users array:', users);

      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid work email or password");
      }

      console.log('Found user:', foundUser);
      console.log('User role from API:', foundUser.role);

      const userData = {
        ...foundUser,
        name: `${foundUser.first_name} ${foundUser.last_name}`,
        role: foundUser.role || 'data_steward', // Ensure role is stored
        loginTime: new Date().toISOString(),
      };

      console.log('User data to store:', userData);
      console.log('Role in userData:', userData.role);

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      // FIXED: Using 'err' so ESLint doesn't complain it is unused
      const message = err.response?.data?.message || err.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    error,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}