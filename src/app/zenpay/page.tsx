"use client";

import React, { useEffect, useState } from 'react';
import './styles.css';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Payment {
  amount: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  orderId: string;
  id: string;
}

const authorizedEmail = "cobrakingrizwan@gmail.com";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false); // Add client-only state
  const auth = getAuth();

  useEffect(() => {
    setIsClient(true); // Set client-only state on mount
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'payments'));
        const paymentsData: Payment[] = [];
        querySnapshot.forEach((doc) => {
          paymentsData.push({ ...doc.data(), id: doc.id } as Payment);
        });
        setPayments(paymentsData);
        setFilteredPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching payments: ', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.email === authorizedEmail) {
      fetchPayments();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = payments.filter((payment) =>
      payment.firstName.toLowerCase().includes(lowercasedQuery) ||
      payment.lastName.toLowerCase().includes(lowercasedQuery) ||
      payment.orderId.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredPayments(filtered);
  }, [searchQuery, payments]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setUser(null);
    toast.info('You have logged out.');
  };

  const handleSortChange = () => {
    const sortedPayments = [...filteredPayments].sort((a, b) => {
      const amountA = parseFloat(a.amount);
      const amountB = parseFloat(b.amount);
      return sortOrder === 'asc' ? amountA - amountB : amountB - amountA;
    });
    setFilteredPayments(sortedPayments);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (!isClient) return null; // Render nothing on the server

  if (loading && !isAuthenticated) {
    return (
      <div className="login-container">
        <h2>Login to View Payments</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    );
  }

  if (user && user.email !== authorizedEmail) {
    return (
      <div className="unauthorized-container">
        <p>You do not have access to view this data.</p>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    );
  }

  return (
    <div className="payments-container">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <h1>Payments List</h1>

      <div className="controls-container">
        <input
          type="text"
          placeholder="Search by First Name, Last Name, or Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSortChange} className="sort-button">
          Sort by Amount ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>

      {filteredPayments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="payments-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount (USD)</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Card Number</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.orderId}</td>
                <td>{payment.amount}</td>
                <td>{payment.firstName}</td>
                <td>{payment.lastName}</td>
                <td>{payment.cardNumber}</td>
                <td>{payment.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
