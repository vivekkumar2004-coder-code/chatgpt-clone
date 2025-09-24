import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome to ChatGPT Clone
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Get started by signing in to your account or creating a new one.
        </p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 block text-center"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 block text-center"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
