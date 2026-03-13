import React, { useState } from "react"; // Import React and useState hook for state management
import TaskList from "./TaskList"; // Import TaskList component (assumed to show all tasks)
import TaskPriority from "./TaskPriority"; // Import TaskPriority component (assumed to show tasks by priority)

// Define the TaskPriorityNav functional component
const TaskPriorityNav = () => {
  // Initialize state with useState: activeTab tracks the current view, starting with "list"
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="space-y-4"> {/* Outer container with vertical spacing */}
      {/* Navigation Tabs Section */}
      <div className="border-b border-gray-700"> {/* Container with a bottom border */}
        <nav className="flex"> {/* Flexbox navigation bar for tab buttons */}
          {/* Button for "All Tasks" view */}
          <button
            onClick={() => setActiveTab("list")} // Updates activeTab to "list" when clicked
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === "list"
                ? "border-blue-500 text-blue-500" // Styles for active tab
                : "border-transparent text-gray-400 hover:text-gray-300" // Styles for inactive tab
            } transition-colors duration-200`} // Smooth color transition effect
          >
            All Tasks {/* Button label */}
          </button>
          {/* Button for "Priority View" */}
          <button
            onClick={() => setActiveTab("priority")} // Updates activeTab to "priority" when clicked
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === "priority"
                ? "border-blue-500 text-blue-500" // Styles for active tab
                : "border-transparent text-gray-400 hover:text-gray-300" // Styles for inactive tab
            } transition-colors duration-200`} // Smooth color transition effect
          >
            Priority View {/* Button label */}
          </button>
        </nav>
      </div>

      {/* Content Area: Conditionally render based on activeTab */}
      <div>
        {activeTab === "list" ? (
          <TaskList /> // Show TaskList component if activeTab is "list"
        ) : (
          <TaskPriority /> // Show TaskPriority component if activeTab is "priority"
        )}
      </div>
    </div>
  );
};

export default TaskPriorityNav; // Export the component for use elsewhere