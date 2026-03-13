import React from "react"; // Import React to build the user interface
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks for state management
import { login } from "../store/taskSlice"; // Import the login action from taskSlice
import TaskInput from "./TaskInput"; // Import TaskInput component for adding tasks
import TaskPriorityNav from "./TaskPriorityNav"; // Import TaskPriorityNav for task navigation

// Define the Auth functional component
const Auth = () => {
  // Retrieve the authentication status from the Redux store
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  // Get the dispatch function to trigger Redux actions
  const dispatch = useDispatch();

  return (
    <div>
      {" "}
      {/* Main container for the component */}
      {isAuthenticated ? ( // Conditionally render based on authentication status
        <div className="space-y-6">
          {" "}
          {/* Container for task management UI with vertical spacing */}
          <h2 className="text-xl font-bold text-gray-200 mb-4">
            Your Tasks
          </h2>{" "}
          {/* Tasks section header */}
          <TaskInput /> {/* Component to input new tasks */}
          <TaskPriorityNav /> {/* Component for navigating task views */}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-md p-8 text-center">
          {" "}
          {/* Container for login prompt */}
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            Welcome to TaskMaster
          </h2>{" "}
          {/* Welcome message */}
          <p className="text-gray-400 mb-8">
            Please login to manage your tasks
          </p>{" "}
          {/* Login instruction */}
          <button
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium flex items-center gap-2 mx-auto"
            onClick={() => dispatch(login())} // Trigger login action on click
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Login {/* Button text */}
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth; // Export the component for use in other parts of the app
