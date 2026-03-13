// Import necessary dependencies from React and Redux
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store/taskSlice"; // Import logout action from the taskSlice
import Weather from "./components/Weather"; // Import Weather component for displaying weather info
import Auth from "./components/Auth"; // Import Auth component for authentication handling

// Define the main App component
const App = () => {
  // Access the authentication status from the Redux store using useSelector
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  // Initialize the dispatch function to trigger Redux actions
  const dispatch = useDispatch();

  // Use useEffect to enable dark mode styling on component mount
  useEffect(() => {
    // Add the 'dark' class to the HTML root element for dark mode
    document.documentElement.classList.add("dark");
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    // Main container with full-screen height, dark background, and responsive padding
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6">
      {/* Centered content container with a maximum width */}
      <div className="max-w-md mx-auto">
        {/* Header section with title, tagline, and logout button */}
        <header className="flex justify-between items-center mb-10">
          <div>
            {/* App title with bold, white styling */}
            <h1 className="text-3xl font-bold text-white">TaskMaster</h1>
            {/* Subtitle with smaller, muted text */}
            <p className="text-gray-400 text-sm">
              Organize your day, boost your productivity
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Conditionally render logout button when user is authenticated */}
            {isAuthenticated && (
              <button
                onClick={() => dispatch(logout())} // Trigger logout action on click
                className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {/* Render the Weather component to show weather details */}
        <Weather />

        {/* Authentication section with styled container */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
          {/* Render the Auth component for login/logout functionality */}
          <Auth />
        </div>

        {/* Footer with dynamic copyright year */}
        <footer className="mt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

// Export the App component as the default export
export default App;
