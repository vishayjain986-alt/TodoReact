// Importing the essentials:
// - React to build the UI
// - useDispatch and useSelector from react-redux to manage state
// - toggleTask and deleteTask actions from our taskSlice for updating tasks
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTask, deleteTask } from "../store/taskSlice";

// TaskList component: This is where we show all the tasks and let users interact with them
const TaskList = () => {
  // Grab the tasks array from the Redux store
  const tasks = useSelector((state) => state.tasks);
  // Get the dispatch function so we can trigger actions like toggling or deleting tasks
  const dispatch = useDispatch();

  // If there aren’t any tasks yet, show a friendly message to nudge the user to add one
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p>No tasks yet. Add a task to get started!</p>
      </div>
    );
  }

  // Here’s where we render the task list
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        // Each task gets its own list item, styled dynamically based on whether it’s completed
        <li
          key={task.id} // Unique key for React to keep track of each task
          className="bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between border-l-4 hover:shadow-md transition-shadow duration-200"
          style={{ borderLeftColor: task.completed ? "#10B981" : "#3B82F6" }} // Green border for done, blue for not done
        >
          {/* Left side: toggle button and task text */}
          <div className="flex items-center gap-3 flex-grow">
            {/* Button to mark a task as done or undone */}
            <button
              onClick={() => dispatch(toggleTask(task.id))} // Clicking this flips the task’s completion status
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                task.completed
                  ? "bg-green-500 border-green-500 text-white" // Green and filled when completed
                  : "border-blue-400" // Just a blue outline when not completed
              }`}
            >
              {/* Show a checkmark only if the task is completed */}
              {task.completed && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            {/* The task’s text, crossed out if completed */}
            <span
              className={
                task.completed ? "text-gray-400 line-through" : "text-gray-200"
              }
            >
              {task.text}
            </span>
          </div>
          {/* Right side: creation date and delete button */}
          <div className="flex items-center gap-2">
            {/* Show when the task was created in a short, readable format */}
            <span className="text-xs text-gray-500 mr-2">
              {new Date(task.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {/* Delete button to remove the task */}
            <button
              className="text-gray-500 hover:text-red-400 transition-colors duration-200 cursor-pointer"
              onClick={() => dispatch(deleteTask(task.id))} // Clicking this deletes the task
              aria-label="Delete task" // Accessibility label for screen readers
            >
              {/* Trash can icon for the delete button */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

// Export the component so we can use it elsewhere
export default TaskList;
