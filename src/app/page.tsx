/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import initialData from './data/initialData';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { FaShippingFast, FaCarSide, FaTools, FaHandHoldingUsd, FaTruck, FaPhoneAlt, FaUndoAlt, FaClock, FaFilePdf, FaCalendarAlt } from "react-icons/fa";
import { TestimonialsSection } from './components/Testimonials';
import { CarPartsCardsSection } from './components/CarPartsCard';
import { CarAboutSection } from './components/CarAboutSection';
import { ModalSection } from './components/HomeModalSection';
import { HomeForm } from './components/HomeForm';
import { HomeCarousel } from './components/HomeCarousel';
import Link from 'next/link';

interface DataType {
  years: string[];
  makes: string[];
  models: string[];
  parts: string[];
}

export default function Home() {
  const router = useRouter();

  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [part, setPart] = useState('');
  const [isSubmitClicked, setisSubmitClicked] = useState(false)

  const [modalVisible, setModalVisible] = useState(false);
  const [searchedPart, setSearchedPart] = useState<DataType | null>(null);
  const [searchedPartFormatted, setSearchedPartFormatted] = useState<string>('');
  const [showSearchResult, setShowSearchResult] = useState(false);

  const handleMakeChange = (e: any) => {
    setMake(e.target.value);
    setModel('');
  };
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    if (year && make && model && part) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  useEffect(() => {
    validateForm();
  }, [year, make, model, part]);

  const images = [
    {
      src: '/carouselImages/caro1.jpg',
      alt: 'Car Parts',
      title: 'High-Quality Car Parts',
      description: 'Explore our wide selection of premium car parts for all makes and models.'
    },
    {
      src: '/carouselImages/caro2_01.jpg',
      alt: 'Car Parts',
      title: 'Durable and Reliable',
      description: 'Our parts are built to last, ensuring your car runs smoothly.'
    },
    {
      src: '/carouselImages/caro3_01.jpg',
      alt: 'Car Parts',
      title: 'Affordable Prices',
      description: 'Get the best quality at the most competitive prices in the market.'
    },
    {
      src: '/carouselImages/caro4_01.jpg',
      alt: 'Car Parts',
      title: 'Fast Shipping',
      description: 'We deliver quickly so you can get back on the road as soon as possible.'
    },
    {
      src: '/carouselImages/caro5.jpg',
      alt: 'Car Parts',
      title: 'Customer Satisfaction',
      description: 'Join thousands of satisfied customers who trust our parts.'
    },
  ];

  const formatSearchedPart = (part: DataType | null): string => {
    if (!part) return '';

    return `${part.years.join(', ')} ${part.makes.join(', ')} ${part.models.join(', ')} ${part.parts.join(', ')}`;
  };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [currentImageIndex]);

  useEffect(() => {
    if (searchedPart) {
      const formattedPart = formatSearchedPart(searchedPart);
      setSearchedPartFormatted(formattedPart);
    }
  }, [searchedPart]);

  const handleSearch = () => {
    setSearchedPart({ years: [year], makes: [make], models: [model], parts: [part] });
    if (isValid) {
      setShowSearchResult(true);
      setModalVisible(true);
    }
    else {
      setModalVisible(false);
      toast.error('All fields need to be filled before submitting!');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false); // Close the modal
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setisSubmitClicked(!isSubmitClicked)

    try {
      const response = await fetch('/api/saveSubmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          contact,
          email,
          zipCode,
          searchedPartFormatted,
        }),
      });

      if (response.ok) {
        toast.success('Form submitted successfully!');

        setName('');
        setContact('');
        setEmail('');
        setZipCode('');
        handleModalClose();
        setisSubmitClicked(false);

        router.push('/confirmation');

      } else {
        const errorData = await response.json();
        toast.error('Error submitting the form: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Error submitting the form. Check console for details.');
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#023047",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <section className="w-full p-0">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        <div className="w-full relative">
          <Image
            src="/carouselImages/herosectiono.jpg" // Random image from picsum.photos
            alt="Random Background"
            fill
            style={{ objectFit: 'cover' }}
            className="z-0"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 z-10" />
          <div className="relative z-20 w-full">
            <div className="max-w-7xl mx-auto flex justify-end w-full h-auto px-4 lg:px-6 py-8 md:py-12">
              <div className="flex flex-col md:flex-row w-full gap-8 items-center justify-between">
                {/* Left Hero Text */}
                <div className="flex-1 text-left md:pr-8 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
                    Find Quality Used Auto Parts Fast
                  </h1>
                  <p className="text-lg md:text-xl text-white font-medium mb-8 drop-shadow-md">
                    Affordable. Reliable. Shipped to Your Door.
                  </p>
                  <Link href="/parts" passHref legacyBehavior>
                    <a className="bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 px-8 rounded-md text-lg shadow-lg transition-all duration-200">
                      ALL PARTS
                    </a>
                                    </Link>
                </div>
                {/* Right Form */}
                <div className="w-full md:w-3/5 lg:w-1/2">
                  <HomeForm
                    year={year}
                    setYear={setYear}
                    make={make}
                    setMake={setMake}
                    model={model}
                    setModel={setModel}
                    part={part}
                    setPart={setPart}
                    handleSearch={handleSearch}
                    initialData={{ ...initialData, years: initialData.years.map(String) }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ModalSection
          modalVisible={modalVisible}
          searchedPart={searchedPart}
          name={name}
          setName={setName}
          contact={contact}
          setContact={setContact}
          email={email}
          setEmail={setEmail}
          zipCode={zipCode}
          setZipCode={setZipCode}
          handleSubmit={handleSubmit}
          handleModalClose={handleModalClose}
          isSubmitClicked={isSubmitClicked}
        />
        <CarAboutSection />
        <CarPartsCardsSection />
        <TestimonialsSection />
      </section>
    </div>
  );
}

