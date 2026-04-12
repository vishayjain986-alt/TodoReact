// Import necessary dependencies from React and Redux
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserLoggedIn, setUserLoggedOut, fetchTasks } from "./store/taskSlice";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Weather from "./components/Weather";
import Auth from "./components/Auth";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.classList.add("dark");

    // Firebase Auth Listener
    let isFirstRun = true;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!isFirstRun) {
          toast.success("You have logged in...Crazzyyy!!", {
            duration: 6000,
            icon: "🔥",
            style: {
              background: "#1f2937",
              color: "#f9fafb",
              border: "1px solid #374151",
              fontWeight: "600",
            },
          });
        }
        isFirstRun = false;
        dispatch(
          setUserLoggedIn({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
        dispatch(fetchTasks());
      } else {
        isFirstRun = false;
        dispatch(setUserLoggedOut());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6">
      <Toaster position="top-center" />
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">TaskMaster</h1>
            <p className="text-gray-400 text-sm">
              Organize your day, boost your productivity
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        <Weather />

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
          <Auth />
        </div>

        <footer className="mt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
