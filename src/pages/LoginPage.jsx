// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import logo from "../assets/logo.png"

// function LoginPage() {
//   const navigate = useNavigate();
//   const { login, loading, error, setError } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [formError, setFormError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");
//     setError(null);

//     // Validation
//     if (!email.trim()) {
//       setFormError("Email is required");
//       return;
//     }
//     if (!password) {
//       setFormError("Password is required");
//       return;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setFormError("Please enter a valid email address");
//       return;
//     }

//     const result = await login(email, password);
//     if (result.success) {
//       // Redirect to dashboard on successful login
//       navigate("/dashboard", { replace: true });
//     } else {
//       setFormError(result.error || "Login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden bg-linear-to-br from-indigo-900 via-purple-700 to-pink-500">
//       {/* Decorative Background Elements */}
//       <div className="absolute hidden left-10 bottom-10 opacity-20 md:block">
//         <svg width="120" height="80">
//           <rect x="10" y="30" width="20" height="40" fill="#fff" />
//           <rect x="40" y="20" width="20" height="50" fill="#fff" />
//           <rect x="70" y="10" width="20" height="60" fill="#fff" />
//         </svg>
//       </div>
//       <div className="absolute hidden right-10 top-10 opacity-20 md:block">
//         <svg width="100" height="100">
//           <path d="M10 90 L50 10 L90 90" stroke="#fff" strokeWidth="2" fill="none" />
//         </svg>
//       </div>

//       {/* Login Card */}
//       <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl sm:max-w-lg sm:p-8 lg:p-10">
//         {/* Logo: Display logo in center */}
//         <div className="sidebar-logo flex justify-center mb-4 ">
//                   <img src={logo} alt="DataVista" className="h-14 w-auto" />
//                 </div>

//         {/* Header */}
//         <h2 className="mb-2 text-2xl font-bold text-center text-gray-800 sm:text-3xl lg:text-4xl">
//           Welcome Back
//         </h2>
//         <p className="mb-6 text-sm text-center text-gray-500 sm:text-base">
//           Log in to access your Data Catalog System Dashboard
//         </p>

//         {/* Error Messages */}
//         {(formError || error) && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-sm text-red-700">{formError || error}</p>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email Field */}
//           <div>
//             <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//               disabled={loading}
//             />
//           </div>

//           {/* Password Field */}
//           <div>
//             <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
//               disabled={loading}
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 mt-6 font-semibold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             {loading ? "Signing in..." : "Log In"}
//           </button>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 text-xs text-center text-gray-500">
//           DataVista © 2026. All rights reserved.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;




















// NEW CODE:-
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// // Path matches your structure: src/pages/LoginPage.jsx -> src/context/AuthContext.jsx
// import { useAuth } from '../context/AuthContext'; 
// import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
// import logo from '../assets/logo.png'; 

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({ email: '', password: '' });

//   const navigate = useNavigate();

//   // Destructuring from your AuthContext.jsx
//   // Using 'loading' and renaming 'error' to 'authError' to avoid confusion
//   const { login, loading, error: authError } = useAuth(); 

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Using the login function from your AuthContext
//     const result = await login(formData.email, formData.password);

//     if (result.success) {
//       console.log("Login Successful");
//       navigate('/dashboard'); 
//     }
//   };

//   return (
//     <div className="h-screen w-full bg-[#f1f5f9] font-inter flex items-center justify-center p-4 relative overflow-hidden">

//       {/* Background Graphics */}
//       <div className="absolute inset-0 opacity-[0.05] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" 
//            style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
//       </div>
//       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-300/20 rounded-full blur-[120px] animate-[pulse_8s_infinite]"></div>
//       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-300/20 rounded-full blur-[120px] animate-[pulse_10s_infinite]"></div>

//       <div className="w-full max-w-md z-10 flex flex-col items-center">

//         {/* Branding Area */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-6">
//             <img src={logo} alt="Datavista Logo" className="h-24 w-auto object-contain drop-shadow-2xl" />
//           </div>
//           <h1 className="text-4xl font-black bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 bg-clip-text text-transparent tracking-tight">
//             Welcome
//           </h1>
//           <div className="mt-3 flex items-center justify-center gap-2">
//             <div className="h-[1px] w-8 bg-blue-200"></div>
//             <p className="text-blue-800 font-bold uppercase tracking-[0.2em] text-[10px]">Datavista Catalog</p>
//             <div className="h-[1px] w-8 bg-blue-200"></div>
//           </div>
//         </div>

//         {/* Login Card */}
//         <div className="w-full relative">
//           <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-[32px] blur-xl"></div>
//           <div className="relative bg-white/95 backdrop-blur-sm border border-white rounded-[28px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.12)] overflow-hidden">
//             <form className="p-10 space-y-6" onSubmit={handleSubmit}>

//               {/* Error Alert - Fixes 'authError' assigned but not used */}
//               {authError && (
//                 <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold text-center animate-shake">
//                   {authError}
//                 </div>
//               )}

//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600">
//                     <FiMail size={18} />
//                   </div>
//                   <input 
//                     type="email" 
//                     required
//                     placeholder="name@company.com"
//                     className="w-full !h-12 !pl-12 bg-slate-50/50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm"
//                     value={formData.email}
//                     onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600">
//                     <FiLock size={18} />
//                   </div>
//                   <input 
//                     type={showPassword ? "text" : "password"} 
//                     required
//                     placeholder="••••••••"
//                     className="w-full !h-12 !pl-12 bg-slate-50/50 border border-slate-100 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm"
//                     value={formData.password}
//                     onChange={(e) => setFormData({...formData, password: e.target.value})}
//                   />
//                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-blue-600 transition-colors cursor-pointer">
//                     {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
//                   </button>
//                 </div>
//               </div>

//               {/* Submit Button - Fixes 'loading' usage and 'isLoading' undefined */}
//               <div className="pt-2">
//                 <button 
//                   type="submit" 
//                   disabled={loading}
//                   className={`group relative w-full ${loading ? 'bg-emerald-600' : 'bg-[#00a65a]'} text-white py-4 rounded-xl font-bold text-sm overflow-hidden shadow-xl shadow-emerald-900/20 transition-all active:scale-[0.98] cursor-pointer`}
//                 >
//                   <span className="relative z-10 flex items-center justify-center gap-2">
//                     {loading ? (
//                       <div className="flex items-center gap-2">
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         Authenticating...
//                       </div>
//                     ) : (
//                       <>LogIn <FiArrowRight className="group-hover:translate-x-1 transition-transform" /></>
//                     )}
//                   </span>
//                   {!loading && <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         <div className="mt-10 flex flex-col items-center gap-3">
//           <div className="h-[2px] w-6 bg-slate-200 rounded-full"></div>
//           <p className="text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase">datavista @2026 all right reserved</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;












// NEW CODE 1 :-  RESPONSIVE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // result will now be based on axios response from mock server
    const result = await login(formData.email, formData.password);
    if (result.success) {
      // Route based on user role
      const userRole = result.user?.role || 'data_steward';
      if (userRole === 'system_admin') {
        navigate('/compliance-reporting');  // System admin goes to compliance reporting
      } else if (userRole === 'compliance_officer') {
        navigate('/governance');  // Compliance officer goes to governance
      } else {
        navigate('/dashboard');  // Data steward goes to dashboard
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] font-inter flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background patterns hidden on small mobile for performance */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none hidden sm:block"
        style={{ backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
      </div>

      <div className="w-full max-w-[440px] z-10">
        <div className="text-center mb-6 md:mb-10">
          <img src={logo} alt="Datavista" className="h-24 mx-auto mb-6 object-contain" />
          {/* <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Welcome</h1>
          <p className="text-blue-800 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Datavista Catalog</p> */}
        </div>

        <div className="bg-white/95 backdrop-blur-sm border border-white rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden">
          <form className="p-6 md:p-10 space-y-5 md:space-y-6" onSubmit={handleSubmit}>
            {authError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs text-center font-bold">
                {authError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={18} />
                <input
                  type="email" required placeholder="name@company.com"
                  className="w-full h-12 pl-12 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={18} />
                <input
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  className="w-full h-12 pl-12 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-[#00a65a] hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : <>LogIn <FiArrowRight /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;