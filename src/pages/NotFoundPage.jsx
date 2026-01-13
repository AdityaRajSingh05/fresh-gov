import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          // FIXED: Changed "/login" to "/" to match your App.jsx route
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;