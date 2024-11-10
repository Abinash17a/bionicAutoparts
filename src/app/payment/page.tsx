'use client';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './styles.css';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useRouter } from 'next/router';  // Import useRouter for redirection
import { useRouter } from 'next/navigation';

interface FormData {
  orderId: string;
  amount: string;
  firstName: string;
  lastName: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
}

export default function PaymentPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    orderId: '',
    amount: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    cvv: '',
    expiryDate: '',
  });

  const router = useRouter();  // Initialize the useRouter hook

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'expiryDate') {
      const formattedValue = value.replace(/\D/g, '');
      let newValue = formattedValue;

      if (formattedValue.length > 2) {
        newValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }
      setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    }
    else if (name === 'cardNumber') {
      const formattedValue = value.replace(/\D/g, '').replace(/(.{4})(?=.)/g, '$1-');
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    }
    // Ensure orderId is alphanumeric
    else if (name === 'orderId') {
      const formattedValue = value.replace(/[^a-zA-Z0-9]/g, '');
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentDate = new Date();
    const [month, year] = formData.expiryDate.split('/');

    if (!month || !year || month.length !== 2 || year.length !== 2) {
      toast.error('Invalid expiry date format. Please use MM/YY.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);

    if (expiryYear < currentDate.getFullYear() % 100) {
      toast.error('Expiry date cannot be in the past.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    if (expiryYear === currentDate.getFullYear() % 100 && expiryMonth < currentDate.getMonth() + 1) {
      toast.error('Expiry date cannot be in the past.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    if (!/^[A-Za-z]+$/.test(formData.firstName)) {
      toast.error('First name must only contain letters.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    if (!/^[A-Za-z]+$/.test(formData.lastName)) {
      toast.error('Last name must only contain letters.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    if (!/^[A-Za-z0-9]+$/.test(formData.orderId)) {
      toast.error('Order ID must be alphanumeric.', { position: 'top-center', autoClose: 3000 });
      return;
    }

    try {
      await addDoc(collection(db, 'payments'), formData);
      toast.success('Payment will be processed soon!', { position: "top-center", autoClose: 3000 });

      // Redirect to homepage after 3 seconds
      setTimeout(() => {
        router.push('/');  // Redirect to homepage
      }, 3000);

      setFormData({
        orderId: '',
        amount: '',
        firstName: '',
        lastName: '',
        cardNumber: '',
        cvv: '',
        expiryDate: '',
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Failed to save payment details.', { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="orderId">Order ID</label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            required
            placeholder="Enter Order ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (USD)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount in USD"
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="First Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Last Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength={19}
            required
            placeholder="16-digit Card Number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            maxLength={3}
            required
            placeholder="CVV"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            maxLength={5}
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit Payment</button>
      </form>

      <ToastContainer />
    </div>
  );
}
