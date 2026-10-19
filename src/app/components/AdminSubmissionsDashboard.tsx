'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './Ui/Card';

interface AdminSubmissionsDashboardProps {
  collection: 'submissions' | 'submissionsv2';
  title?: string;
}

export default function AdminSubmissionsDashboard({
  collection,
  title = 'Admin Dashboard',
}: AdminSubmissionsDashboardProps) {
  const [userData, setUserData] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getSubmissionsUrl = collection === 'submissionsv2' ? '/api/getSubmissionsv2' : '/api/getSubmissions';
  const updateStatusUrl = collection === 'submissionsv2' ? '/api/updateSubmissionStatusv2' : '/api/updateSubmissionStatus';
  const uploadImageUrl = collection === 'submissionsv2' ? '/api/uploadImagev2' : '/api/uploadImage';

  const clearTimers = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (fetchIntervalRef.current) {
      clearInterval(fetchIntervalRef.current);
      fetchIntervalRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(() => {
    setLoading(true);
    auth.signOut()
      .then(() => {
        toast.info('Logged out');
        setIsLoggedIn(false);
        setUserData([]);
        localStorage.removeItem('isLoggedIn');
        clearTimers();
      })
      .catch((err) => {
        console.error('Logout error:', err);
      })
      .finally(() => setLoading(false));
  }, [clearTimers]);

  const resetLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(handleLogout, 2 * 60 * 60 * 1000);
  }, [handleLogout]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getSubmissionsUrl}?timestamp=${Date.now()}`);
      const data = await response.json();
      if (response.ok) {
        const sortedData = (data.submissions || []).sort((a: any, b: any) => {
          const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date();
          const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date();
          return dateB.getTime() - dateA.getTime();
        });
        setUserData(sortedData);
      } else {
        console.error('Error fetching submissions:', data.message);
      }
    } catch (err) {
      console.error('Error in fetchData:', err);
    } finally {
      setLoading(false);
    }
  }, [getSubmissionsUrl]);

  useEffect(() => {
    setIsMounted(true);
    const loggedInUser = localStorage.getItem('isLoggedIn');
    if (loggedInUser === 'true') {
      setIsLoggedIn(true);
      fetchData();
      resetLogoutTimer();
      fetchIntervalRef.current = setInterval(fetchData, 4 * 60 * 1000);
    }
    return () => clearTimers();
  }, [fetchData, resetLogoutTimer, clearTimers]);

  useEffect(() => {
    if (isLoggedIn) {
      resetLogoutTimer();
      const events = ['click', 'mousemove', 'keydown'];
      const onUserActivity = () => resetLogoutTimer();
      events.forEach((event) => window.addEventListener(event, onUserActivity));
      return () => {
        events.forEach((event) => window.removeEventListener(event, onUserActivity));
      };
    }
  }, [isLoggedIn, resetLogoutTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      fetchData();
      resetLogoutTimer();
      fetchIntervalRef.current = setInterval(fetchData, 4 * 60 * 1000);
      setPassword('');
    } catch (err: any) {
      setError(err.message);
      toast.error('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (submissionId: string, status: string) => {
    try {
      const response = await fetch(updateStatusUrl, {
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
    } catch {
      toast.error('Error updating status');
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    submissionId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const maxSizeMB = 5;
      if (file.size / 1024 / 1024 > maxSizeMB) {
        toast.error(`Image too large. Max ${maxSizeMB}MB allowed.`);
        return;
      }

      const formData = new FormData();
      formData.append('partImage', file);

      const uploadRes = await fetch(`/api/getImageUrl/${submissionId}`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text().catch(() => null);
        throw new Error(errText || 'Image upload to S3 failed');
      }

      const { imageUrl } = await uploadRes.json();
      if (!imageUrl) throw new Error('No imageUrl returned from S3 upload');

      toast.success('Image uploaded to the Order!');

      const updateRes = await fetch(uploadImageUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: submissionId, imageUrl }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok) {
        throw new Error(updateData.error || 'Failed to update submission with image URL');
      }

      toast.success('Submission image updated!');

      setUserData((prev) =>
        prev.map((s: any) => (s.id === submissionId ? { ...s, partImageUrl: imageUrl } : s))
      );
    } catch (err: any) {
      console.error('Error in handleImageUpload:', err);
      toast.error(err.message || 'Image upload failed');
    }
  };

  const formatDate = (timestamp: any) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return 'N/A';
  };

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
              className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">{title}</h2>

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
                        handleImageUpload={(e) => handleImageUpload(e, submission.id)}
                        id={submission.id}
                        className="hover:shadow-lg transition-shadow duration-200"
                        partImageUrl={submission.partImageUrl}
                        partImageUrls={submission.partImageUrls}
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
            className="mt-8 bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </>
      )}
      <ToastContainer />
    </div>
  );
}
