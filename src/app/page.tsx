/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import initialData from './data/initialData';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';


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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatSearchedPart = (part: DataType | null): string => {
    if (!part) return '';

    return `${part.years.join(', ')} ${part.makes.join(', ')} ${part.models.join(', ')} ${part.parts.join(', ')}`;
  };
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
        // backgroundImage: "url('/mainpagebg.jpg')",
        backgroundColor: "#023047",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <section className="w-full px-6 py-16 bg-white bg-opacity-100">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        {/* Top section divided into two parts */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:space-x-6 w-full h-auto">
            {/* Carousel Section */}
            <div className="relative w-full h-[300px] md:w-1/2 md:h-[500px]">
              <Image
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 w-full max-w-lg px-2 md:px-4">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-2 md:mb-4 drop-shadow-lg">
                  {images[currentImageIndex].title}
                </h2>
                <p className="text-base md:text-2xl font-medium drop-shadow-md">
                  {images[currentImageIndex].description}
                </p>
              </div>

              {/* Navigation Buttons - visible only on medium screens and above */}
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-1 md:p-2 rounded-full shadow-lg hover:bg-opacity-30 hover:scale-110 focus:outline-none hidden md:block"
                aria-label="Previous Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-20 text-white p-1 md:p-2 rounded-full shadow-lg hover:bg-opacity-30 hover:scale-110 focus:outline-none hidden md:block"
                aria-label="Next Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Form Section */}
            <div className="flex flex-col w-full md:w-1/2 bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-[#219ebc]">Find the Parts You Need</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="year" className="block font-medium text-[#219ebc]">Year</label>
                  <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219ebc] focus:border-[#219ebc]"
                  >
                    <option value="">Select Year</option>
                    {initialData.years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="make" className="block font-medium text-[#219ebc]">Make</label>
                  <select
                    id="make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219ebc] focus:border-[#219ebc]"
                  >
                    <option value="">Select Make</option>
                    {initialData.makes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="model" className="block font-medium text-[#219ebc]">Model</label>
                  <select
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219ebc] focus:border-[#219ebc]"
                    disabled={!make}
                  >
                    <option value="">Select Model</option>
                    {make && initialData.models[make]?.map((mod:any) => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="part" className="block font-medium text-[#219ebc]">Part</label>
                  <select
                    id="part"
                    value={part}
                    onChange={(e) => setPart(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#219ebc] focus:border-[#219ebc]"
                  >
                    <option value="">Select Part</option>
                    {initialData.parts.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setModalVisible(true);
                    handleSearch();
                  }}
                  className="w-full bg-[#219ebc] text-white p-2 rounded-md hover:bg-[#8ecae6] transition"
                >
                  Search Part
                </button>
              </form>
            </div>
          </div>
        </div>


        {/* Modal for filling details */}
        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-md p-8 w-11/12 md:w-1/2 lg:w-1/3 shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-center">
                {searchedPart?.years.join(', ')} {searchedPart?.makes.join(', ')} {searchedPart?.models.join(', ')} {searchedPart?.parts.join(', ')}
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // Update state on input change
                    className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-gray-700 font-medium">Contact Number</label>
                  <input
                    type="tel"
                    id="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)} // Update state on input change
                    className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update state on input change
                    className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zipcode" className="block text-gray-700 font-medium">Zip Code</label>
                  <input
                    type="text"
                    id="zipcode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)} // Update state on input change
                    className="block w-full mt-1 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="mt-6 space-y-4">
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-md font-bold transition duration-300
        ${isSubmitClicked ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'}
        text-white`}
                    disabled={isSubmitClicked}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="w-full bg-gray-600 text-white py-3 rounded-md font-bold transition duration-300 hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 px-6 lg:px-20">
          {/* Left side: Writing */}
          <div className="p-8 lg:p-10 rounded-lg bg-white">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900">
              More Information About Car Parts
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At our store, you will find a wide range of car parts for every model and make. Whether you are looking for engine components, body parts, or interior accessories, we have it all.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Our team is dedicated to providing you with the best options to maintain and upgrade your vehicle. Get the parts you need at competitive prices and with fast shipping.
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900">Shipping and Returns</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Shipping Policy:</strong> We can ship to virtually any address in the world. Note that there are restrictions on some products, and some products cannot be shipped internationally.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              When you place an order, we will estimate shipping and delivery dates for you based on item availability and selected shipping options.
            </p>

            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900">Returns Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you need to return an item, you may call or text +1 617-390-7248, email auth@bionicsautoparts.com, or chat with us here. Our goal is to provide a smooth and efficient return process. Note that while refunds are issued within 1-2 days of return, the credit card processor may take an additional 3-5 days to process.
            </p>
            <p className="mt-4">
              <a
                href="/files/warranty.pdf"
                target="_blank"
                className="text-blue-600 underline hover:text-blue-800 font-semibold"
                rel="noopener noreferrer"
              >
                Terms and Conditions (PDF)
              </a>
            </p>
          </div>

          {/* Right side: Images */}
          <div className="grid grid-cols-2 gap-6">
            {["/mainpage1.jpg", "/mainpage2.jpg", "/mainpage3.jpg", "/mainpage4.jpg"].map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Car Part ${index + 1}`}
                width={250}
                height={150}
                className="rounded-md w-full transform transition-transform duration-300 hover:scale-105 shadow-lg"
              />
            ))}
          </div>
        </div>


        <div className="mt-16 px-6 lg:px-20">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Explore Our Car Parts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="card-container">
              <div className="image-wrapper">
                <Image
                  src="/cardmpageengine.jpg"
                  alt="Engine Parts"
                  width={500}
                  height={300}
                  className="object-cover rounded-t-lg w-full h-full"
                />
              </div>
              <div className="card-content">
                <h3 className="text-xl font-bold text-gray-900">Engine Parts</h3>
                <p className="text-gray-600 mt-2 flex-grow">
                  Browse a wide selection of high-performance engine components that will keep your vehicle running smoothly.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card-container">
              <div className="image-wrapper">
                <Image
                  src="/cardinteriormpage.jpg"
                  alt="Body Parts"
                  width={500}
                  height={300}
                  className="object-cover rounded-t-lg w-full h-full"
                />
              </div>
              <div className="card-content">
                <h3 className="text-xl font-bold text-gray-900">Body Parts</h3>
                <p className="text-gray-600 mt-2 flex-grow">
                  Find everything from bumpers to fenders to give your car a fresh new look.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card-container">
              <div className="image-wrapper">
                <Image
                  src="/cardcarpartsmpage.jpg"
                  alt="Interior Accessories"
                  width={500}
                  height={300}
                  className="object-cover rounded-t-lg w-full h-full"
                />
              </div>
              <div className="card-content">
                <h3 className="text-xl font-bold text-gray-900">Interior Accessories</h3>
                <p className="text-gray-600 mt-2 flex-grow">
                  Upgrade your car's interior with stylish and functional accessories.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Testimonials Section */}
        <div className="mt-16 px-6 lg:px-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="testimonial-card">
              <p className="text-gray-700 italic">
                "I recently purchased a part for my project, and I couldn't be more satisfied. The quality is outstanding, and it fits perfectly. The ordering process was smooth, and it arrived on time. Highly recommend this part to anyone in need!"
              </p>
              <p className="text-blue-500 font-semibold mt-4">- Jay</p>
              <p className="text-gray-500 font-medium mt-1">Ford F350</p>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card">
              <p className="text-gray-700 italic">
                "I found the exact part I needed in no time! The service was quick and reliable, making my repair process so much easier."
              </p>
              <p className="text-blue-500 font-semibold mt-4">- Brenda</p>
              <p className="text-gray-500 font-medium mt-1">Dodge Charger</p>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card">
              <p className="text-gray-700 italic">
                "An excellent service when it comes to 'Used car spare parts'."
              </p>
              <p className="text-blue-500 font-semibold mt-4">- Damien</p>
              <p className="text-gray-500 font-medium mt-1">Chevy S10</p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
