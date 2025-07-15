/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../components/Ui/Card';

const Admin = () => {
  const [userData, setUserData] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);
  const [fetchInterval, setFetchInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const loggedInUser = localStorage.getItem('isLoggedIn');
    if (loggedInUser === 'true') {
      setIsLoggedIn(true);
      fetchData(); // Fetch data if already logged in
      resetLogoutTimer();
      setFetchInterval(setInterval(fetchData, 4 * 60 * 1000)); // Fetch every 4 minutes
    }
  }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true'); // Persist login status
      fetchData();
      resetLogoutTimer();
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
      const response = await fetch(`/api/getSubmissions?timestamp=${new Date().getTime()}`);
      const data = await response.json();
      if (response.ok) {
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
      setLoading(false);
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
    const newLogoutTimer = setTimeout(handleLogout, 2 * 60 * 60 * 1000);
    setLogoutTimer(newLogoutTimer);
  };

  const handleLogout = () => {
    setLoading(true);
    auth.signOut()
      .then(() => {
        toast.info('Logged out ');
        setIsLoggedIn(false);
        setUserData([]);
        localStorage.removeItem('isLoggedIn');
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
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h2>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-300 h-16 w-16 animate-spin"></div>
            </div>
          ) : (
            <>
              {userData.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userData.map((submission) => (
                    <li key={submission.id}>
                      <Card
                        variant="submission"
                        name={submission.name}
                        contact={submission.contact}
                        email={submission.email}
                        zipCode={submission.zipCode}
                        searchedPartFormatted={submission.searchedPartFormatted}
                        orderId={submission.orderId}
                        createdAt={formatDate(submission.createdAt)}
                        status={submission.status}
                        onStatusChange={(newStatus) => handleStatusChange(submission.id, newStatus)}
                        className="hover:shadow-lg transition-shadow duration-200"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No submissions available.</p>
              )}
            </>
          )}

          <button
            onClick={handleLogout}
            className="mt-8 bg-red-600 text-white p-3 rounded-md"
          >
            Logout
          </button>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default Admin;

