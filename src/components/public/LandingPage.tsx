import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center">

            {/* Header/Navigation */}
            <header className="w-full bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-indigo-700">
                        KASU Result Grievance System
                    </div>
                    <nav className="space-x-4">
                        <Link to="/login" className="px-4 py-2 text-indigo-600 font-medium border border-indigo-600 rounded-md hover:bg-indigo-50 transition duration-150">
                            Log In
                        </Link>
                        <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-150">
                            Student Sign Up
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                <div className="text-center">
                    <h1 className="text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                        Resolve Your Results, Simply.
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
                        The official system for submitting, tracking, and resolving result-related grievances for all Kasu students. Transparency and efficiency guaranteed.
                    </p>
                    <div className="mt-10 flex justify-center space-x-6">
                        <Link 
                            to="/login"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-xl text-white bg-indigo-600 hover:bg-indigo-700 transform transition duration-300 hover:scale-[1.02]"
                        >
                            Get Started (Login)
                        </Link>
                        <Link 
                            to="/register"
                            className="inline-flex items-center justify-center px-8 py-4 border border-indigo-600 text-lg font-medium rounded-xl shadow-xl text-indigo-600 bg-white hover:bg-indigo-50 transform transition duration-300 hover:scale-[1.02]"
                        >
                            New Student? Register
                        </Link>
                    </div>
                </div>

                {/* Feature Overview Section */}
                <div className="mt-24">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Feature Card 1 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500 hover:shadow-2xl transition duration-300">
                            <div className="text-3xl text-red-600 mb-3">📝</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Complaint</h3>
                            <p className="text-gray-600">Students log in and easily submit a detailed grievance form with evidence for specific courses and scores.</p>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500 hover:shadow-2xl transition duration-300">
                            <div className="text-3xl text-yellow-600 mb-3">🔍</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Staff Review & Track</h3>
                            <p className="text-gray-600">Admin assigns the case to the responsible lecturer. Both parties track the status (Under Review, Lecturer Responded).</p>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-2xl transition duration-300">
                            <div className="text-3xl text-green-600 mb-3">✅</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Resolution & Audit</h3>
                            <p className="text-gray-600">Once verified by Admin, the case is marked 'Resolved'. A full audit trail ensures transparency.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-gray-800 text-white mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm">
                    © {new Date().getFullYear()} KASU Result Grievance System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;