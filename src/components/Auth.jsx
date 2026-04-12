import React, { useState } from "react";
import { useSelector } from "react-redux";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import TaskInput from "./TaskInput";
import TaskPriorityNav from "./TaskPriorityNav";

const Auth = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-200 mb-4">Your Tasks</h2>
          <TaskInput />
          <TaskPriorityNav />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg text-center p-2">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400 mb-6">
            {isLogin ? "Please login to manage your tasks" : "Sign up to get started"}
          </p>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <form onSubmit={handleAuth} className="space-y-4 mb-6">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="px-3 text-gray-400 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-gray-900 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium flex items-center justify-center gap-2 mb-4 shadow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path fill="none" d="M1 1h22v22H1z" />
            </svg>
            Sign in with Google
          </button>

          <p className="text-gray-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="text-blue-400 hover:text-blue-300 underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Auth;
