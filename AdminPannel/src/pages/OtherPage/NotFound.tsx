import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="404 Page Not Found | PR WEBSTOCK Admin Panel"
        description="The page you are looking for does not exist in PR WEBSTOCK Admin Panel."
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        
        {/* ===== Background Animated Circles ===== */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-purple-300 opacity-30 animate-pulse blur-3xl"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-blue-400 opacity-30 animate-pulse blur-3xl"></div>

        {/* ===== Main Content ===== */}
        <div className="z-10 text-center">
          <h1 className="text-6xl font-extrabold text-gray-800 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track!
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* ===== Footer ===== */}
        <p className="absolute text-sm text-gray-500 bottom-6 left-1/2 -translate-x-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - PR WEBSTOCK
        </p>
      </div>
    </>
  );
}
