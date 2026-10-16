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
import { INVENTORY_ITEMS } from './data/inventoryData';
import InventoryCard from './components/InventoryCard';

interface DataType {
  years: string[];
  makes: string[];
  models: string[];
  parts: string[];
}

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

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
    setIsMounted(true);
  }, []);

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

  if (!isMounted) {
    return null;
  }

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
            <div className="max-w-7xl mx-auto w-full h-auto px-4 lg:px-6 pt-28 pb-8 md:py-12">
              <div className="flex flex-col md:flex-row w-full gap-8 items-center justify-between">
                {/* Left Hero Text */}
                <div className="flex-1 text-left md:pr-8 mb-10 md:mb-0">
                  <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/40 mb-4 backdrop-blur-sm">
                    Certified Recycled OEM Auto Parts
                  </span>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                    Find Quality Used Auto Parts Fast
                  </h1>
                  <p className="text-lg md:text-xl text-blue-100 font-medium mb-6 drop-shadow-md">
                    Compression-tested engines, bench-tested transmissions, and factory body panels with 6-month warranty and nationwide freight.
                  </p>

                  {/* Desktop Category Shortcuts & CTA */}
                  <div className="hidden md:block">
                    <div className="grid grid-cols-2 gap-2.5 mb-6 max-w-md">
                      <Link href="/used-engines" className="px-3.5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 backdrop-blur text-center transition-all">
                        Used Engines
                      </Link>
                      <Link href="/used-transmissions" className="px-3.5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 backdrop-blur text-center transition-all">
                        Used Transmissions
                      </Link>
                      <Link href="/used-body-parts" className="px-3.5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 backdrop-blur text-center transition-all">
                        Body Parts
                      </Link>
                      <Link href="/used-interior-parts" className="px-3.5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 backdrop-blur text-center transition-all">
                        Interior Parts
                      </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/parts" className="inline-flex items-center justify-center bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3.5 px-6 rounded-lg text-sm shadow-lg transition-all duration-200">
                        Browse All Catalog Parts &rarr;
                      </Link>
                      <Link href="/car-guide" className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-lg text-sm shadow-lg transition-all duration-200">
                        🔍 Free US Vehicle Guide (NHTSA & VIN) &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Right Form */}
                <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col items-center">
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

                  {/* Mobile Category Shortcuts & CTA (Below Form) */}
                  <div className="w-full max-w-sm mt-6 md:hidden">
                    <Link href="/parts" className="w-full inline-flex items-center justify-center bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3.5 px-6 rounded-lg text-base shadow-lg transition-all duration-200">
                      Browse All Catalog Parts &rarr;
                    </Link>

                    <Link href="/car-guide" className="w-full mt-2.5 inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg text-sm shadow-lg transition-all duration-200">
                      🔍 Free US Vehicle Guide (NHTSA & VIN) &rarr;
                    </Link>

                    <div className="grid grid-cols-2 gap-2.5 mt-4">
                      <Link href="/used-engines" className="px-3.5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 backdrop-blur text-center transition-all">
                        Used Engines
                      </Link>
                      <Link href="/used-transmissions" className="px-3.5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 backdrop-blur text-center transition-all">
                        Used Transmissions
                      </Link>
                      <Link href="/used-body-parts" className="px-3.5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 backdrop-blur text-center transition-all">
                        Body Parts
                      </Link>
                      <Link href="/used-interior-parts" className="px-3.5 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 backdrop-blur text-center transition-all">
                        Interior Parts
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live In-Stock Inventory Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Live In-Stock Inventory
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Featured Ready-to-Ship Auto Parts
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-1">
                Verified OEM engines, transmissions, and assemblies with 6-month warranty and nationwide freight.
              </p>
            </div>
            <Link
              href="/parts"
              className="inline-flex items-center self-start sm:self-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md shrink-0"
            >
              Browse All Inventory &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INVENTORY_ITEMS.slice(0, 6).map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
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

