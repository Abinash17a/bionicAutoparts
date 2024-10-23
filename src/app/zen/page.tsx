//@typescript-eslint/no-unused-vars
'use client';
import { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
  const [userData, setUserData] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);
  const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true); // Ensures client-side-only rendering
  }, []);

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
      setFetchInterval(setInterval(fetchData, 5 * 60 * 1000)); // Fetch every 5 minutes
      setPassword('');
    } catch (error: any) {
      setError(error.message);
      toast.error('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
  setLoading(true); // Set loading to true while fetching data
  try {
    const response = await fetch('/api/getSubmissions');
    const data = await response.json();
    
    if (response.ok) {
      // Ensure valid dates by using 'new Date()' and check for 'seconds'
      const sortedData = (data.submissions || []).sort((a: any, b: any) => {
        const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date();
        const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date();
        return dateB.getTime() - dateA.getTime();
      });

      setUserData(sortedData);
    } else {
      console.error('Error fetching user data:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false); // Stop loading after data is fetched
  }
};


  const formatDate = (timestamp: any) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return 'N/A';
  };

  const resetLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    const newLogoutTimer = setTimeout(handleLogout, 15 * 60 * 1000);
    setLogoutTimer(newLogoutTimer);
  };

  const handleLogout = () => {
    setLoading(true);
    auth.signOut()
      .then(() => {
        toast.info('Logged out due to inactivity.');
        setIsLoggedIn(false);
        setUserData([]);
        if (logoutTimer) clearTimeout(logoutTimer);
        if (fetchInterval) clearInterval(fetchInterval);
      })
      .catch((error) => {
        console.error('Logout error:', error);
      })
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (submissionId: string, status: string) => {
    try {
      const response = await fetch('/api/updateSubmissionStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId, status }),
      });
      if (response.ok) {
        toast.success('Status updated successfully!');
        fetchData();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      resetLogoutTimer();
      const events = ['click', 'mousemove', 'keydown'];
      events.forEach((event) => window.addEventListener(event, resetLogoutTimer));
      return () => {
        if (logoutTimer) clearTimeout(logoutTimer);
        if (fetchInterval) clearInterval(fetchInterval);
        events.forEach((event) => window.removeEventListener(event, resetLogoutTimer));
      };
    }
  }, [isLoggedIn]);

  // Avoid rendering on server-side
  if (!isMounted) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Login</h3>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-md"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-md"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-md"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h2>
          {loading ? ( // If loading is true, show the loading spinner
            <div className="flex justify-center items-center">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
          ) : (
            <>
              {userData.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {userData.map((submission) => (
                    <li key={submission.id} className="bg-white rounded-lg shadow-md p-6">
                      <p className="text-lg font-semibold text-gray-800 mb-2">{submission.name}</p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Contact:</span> {submission.contact}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Email:</span> {submission.email}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Zip Code:</span> {submission.zipCode}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Part Info:</span> {submission.searchedPartFormatted}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Created At:</span> {formatDate(submission.createdAt)}
                      </p>
                      <div className="mt-4">
                        <select
                          value={submission.status || 'Pending'}
                          onChange={(e) => handleStatusChange(submission.id, e.target.value)}
                          className={`p-2 border rounded ${
                            submission.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : submission.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-700">No submissions found.</p>
              )}
            </>
          )}

          <ToastContainer position="top-right" />
        </>
      )}
    </div>
  );
};

export default Admin;
