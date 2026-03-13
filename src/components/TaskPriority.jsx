import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPriority } from "../store/taskSlice";

const TaskPriority = () => {
  // Access the tasks from Redux store
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  // State for task prioritization filter display
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Priority levels and their corresponding colors
  const priorityLevels = [
    { value: "high", label: "High", color: "#EF4444" }, // Red
    { value: "medium", label: "Medium", color: "#F59E0B" }, // Amber
    { value: "low", label: "Low", color: "#10B981" }, // Green
    { value: "none", label: "None", color: "#6B7280" }, // Gray
  ];

  // Handle changing a task's priority
  const handlePriorityChange = (taskId, priority) => {
    dispatch(setPriority({ taskId, priority }));
  };

  // Filter tasks by priority
  const filteredTasks =
    priorityFilter === "all"
      ? tasks
      : tasks.filter((task) => task.priority === priorityFilter);

  // Count tasks by priority
  const priorityCounts = {
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
    none: tasks.filter((t) => !t.priority || t.priority === "none").length,
  };

  return (
    <div className="space-y-4">
      {/* Priority Filter Section */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setPriorityFilter("all")}
          className={`px-3 py-1 rounded-md text-sm ${
            priorityFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          All ({tasks.length})
        </button>

        {priorityLevels.map((level) => (
          <button
            key={level.value}
            onClick={() => setPriorityFilter(level.value)}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
              priorityFilter === level.value
                ? "bg-gray-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: level.color }}
            ></span>
            {level.label} ({priorityCounts[level.value]})
          </button>
        ))}
      </div>

      {/* Tasks List with Priority Controls */}
      {filteredTasks.length > 0 ? (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            // In the TaskPriority component, modify the li structure:
            <li
              key={task.id}
              className="bg-gray-800 rounded-lg shadow-sm p-4 flex flex-row items-center justify-between border-l-4 hover:shadow-md transition-shadow duration-200"
              style={{
                borderLeftColor:
                  task.priority === "high"
                    ? "#EF4444"
                    : task.priority === "medium"
                    ? "#F59E0B"
                    : task.priority === "low"
                    ? "#10B981"
                    : "#3B82F6",
              }}
            >
              {/* Left side: toggle button and task text */}
              <div className="flex items-center gap-3 flex-grow min-w-0">
                <button
                  onClick={() => dispatch(toggleTask(task.id))}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    task.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-blue-400"
                  }`}
                >
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
                <span
                  className={`${
                    task.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-200"
                  } truncate`}
                >
                  {task.text}
                </span>
              </div>

              {/* Right side: priority dropdown and delete button */}
              <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                <select
                  value={task.priority || "none"}
                  onChange={(e) =>
                    handlePriorityChange(task.id, e.target.value)
                  }
                  className="bg-gray-700 text-gray-200 text-sm rounded-md border-gray-600 focus:ring-blue-500 focus:border-blue-500 p-1"
                >
                  {priorityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                <button
                  className="text-gray-500 hover:text-red-400 transition-colors duration-200"
                  onClick={() => dispatch(deleteTask(task.id))}
                  aria-label="Delete task"
                >
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
      ) : (
        <div className="text-center py-6 text-gray-400">
          <p>No tasks match the selected priority filter.</p>
        </div>
      )}
    </div>
  );
};

export default TaskPriority;
