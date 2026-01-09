import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-700 to-pink-500">
      {/* Decorative Background Elements (hidden on mobile) */}
      <div className="absolute hidden left-10 bottom-10 opacity-20 md:block">
        <svg width="120" height="80">
          <rect x="10" y="30" width="20" height="40" fill="#fff" />
          <rect x="40" y="20" width="20" height="50" fill="#fff" />
          <rect x="70" y="10" width="20" height="60" fill="#fff" />
        </svg>
      </div>
      <div className="absolute hidden right-10 top-10 opacity-20 md:block">
        <svg width="100" height="100">
          <path d="M10 90 L50 10 L90 90" stroke="#fff" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl sm:max-w-lg sm:p-8 lg:p-10">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="p-2 mr-2 bg-blue-600 rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <rect x="4" y="10" width="4" height="10" />
              <rect x="10" y="6" width="4" height="14" />
              <rect x="16" y="2" width="4" height="18" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-blue-700 sm:text-2xl">DataVista</h1>
        </div>

        {/* Header */}
        <h2 className="mb-2 text-2xl font-bold text-center text-gray-800 sm:text-3xl lg:text-4xl">
          Welcome Back 👋
        </h2>
        <p className="mb-6 text-sm text-center text-gray-500 sm:text-base">
          Please login to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 text-gray-800 placeholder-gray-600 bg-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 text-gray-800 placeholder-gray-600 bg-teal-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


