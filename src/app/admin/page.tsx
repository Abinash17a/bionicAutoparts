'use client';

import { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
    const [userData, setUserData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();


    const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);
    const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout | null>(null);

 
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true); 

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login successful!');
            setIsLoggedIn(true);
            fetchData(); 
            resetLogoutTimer();
            setFetchInterval(setInterval(fetchData, 5 * 60 * 1000));
            setPassword('');
        } catch (error: any) {
            setError(error.message);
            toast.error('Login failed: ' + error.message);
        } finally {
            setLoading(false); 
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/getSubmissions');
            const data = await response.json();

            if (response.ok) {
                setUserData(data.submissions || []);
            } else {
                console.error('Error fetching user data:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop loading after data fetch completes
        }
    };

    const formatDate = (timestamp: any) => {
        if (timestamp?.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleString();
        }
        return 'N/A';
    };


    const resetLogoutTimer = () => {
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
        const newLogoutTimer = setTimeout(handleLogout, 15 * 60 * 1000); 
        setLogoutTimer(newLogoutTimer);
    };


    const handleLogout = () => {
        setLoading(true); 
        auth.signOut().then(() => {
            toast.info('You have been logged out due to inactivity.');
            setIsLoggedIn(false);
            setUserData([]);
            setLoading(false);
            if (logoutTimer) {
                clearTimeout(logoutTimer);
                setLogoutTimer(null);
            }
            if (fetchInterval) {
                clearInterval(fetchInterval); // Stop fetching data after logout
                setFetchInterval(null);
            }
        }).catch((error) => {
            console.error('Logout error:', error);
            setLoading(false); // Stop loading even if logout fails
        });
    };

    useEffect(() => {
        auth.signOut().then(() => {
            console.log('Signed out on route access');
            setIsLoggedIn(false);
        }).catch((error) => {
            console.error('Error signing out:', error);
        });


        resetLogoutTimer();

        const activityEvents = ['click', 'mousemove', 'keydown'];
        const resetOnActivity = () => resetLogoutTimer();

        activityEvents.forEach(event =>
            window.addEventListener(event, resetOnActivity)
        );

        return () => {
 
            if (logoutTimer) {
                clearTimeout(logoutTimer);
            }
            if (fetchInterval) {
                clearInterval(fetchInterval);
            }


            activityEvents.forEach(event =>
                window.removeEventListener(event, resetOnActivity)
            );
        };
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>; 
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {!isLoggedIn ? (
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Login</h3>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    <form onSubmit={handleLogin} className="flex flex-col space-y-4 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-3 rounded-md transition duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Login
                        </button>
                    </form>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Admin App</h2>
                    {userData.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {userData.map(submission => (
                                <li key={submission.id} className="bg-white rounded-lg shadow-md p-6">
                                    <p className="text-lg font-semibold text-gray-800 mb-2">{submission.name}</p>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Contact:</span> {submission.contact}</p>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Email:</span> {submission.email}</p>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Zip Code:</span> {submission.zipCode}</p>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Part Info:</span> {submission.searchedPartFormatted}</p>
                                    <p className="text-gray-600 mb-1"><span className="font-medium">Created At:</span> {formatDate(submission.createdAt)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-700">No submissions found.</p>
                    )}

                    <div className="mt-8">
                        <button onClick={handleLogout} className="bg-red-200 text-white p-2 rounded">Log Out</button>
                    </div>
                </>
            )}

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default Admin;
