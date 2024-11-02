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
    { src: '/carouselImages/caro1.jpg', alt: 'Car Parts' },
    { src: '/carouselImages/caro2.jpg', alt: 'Car Parts' },
    { src: '/carouselImages/caro3.jpg', alt: 'Car Parts' },
    { src: '/carouselImages/caro4.jpg', alt: 'Car Parts' },
    { src: '/carouselImages/caro5.jpg', alt: 'Car Parts' }
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
        backgroundImage: "url('/mainpagebg.jpg')", // Replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <section className="container mx-auto px-6 py-8 bg-white bg-opacity-95">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        {/* Top section divided into two parts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: Image carousel */}
          <div className="bg-white-500 p-8 rounded-md">
            <div className="carousel relative">
              <Image
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                width={500}
                height={300}
                className="rounded-md w-full"
              />
              <button
                onClick={handlePrev}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              >
                ❮
              </button>

              <button
                onClick={handleNext}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              >
                ❯
              </button>
            </div>
          </div>

          {/* Right side: Form section */}
          <div className="bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Find the Parts You Need</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="year" className="block text-gray-700">Year</label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Year</option>
                  {initialData.years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="make" className="block text-gray-700">Make</label>
                <select
                  id="make"
                  value={make}
                  onChange={handleMakeChange}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Make</option>
                  {initialData.makes.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="model" className="block text-gray-700">Model</label>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                  disabled={!make} // Disable if no make is selected
                >
                  <option value="">Select Model</option>
                  {make && initialData.models[make]?.map((mod: any) => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="part" className="block text-gray-700">Part</label>
                <select
                  id="part"
                  value={part}
                  onChange={(e) => setPart(e.target.value)}
                  className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
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
                  setModalVisible(true)
                  handleSearch()
                }}
                className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 font-bold"
              >
                Search Part
              </button>
            </form>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
          {/* Left side: Writing */}
          <div className="p-10 rounded-md">
            <h2 className="text-2xl font-bold mb-6">More Information About Car Parts</h2>
            <p className="mb-6">
              At our store, you will find a wide range of car parts for every model and make. Whether you are looking for engine components, body parts, or interior accessories, we have it all.
            </p>
            <p className="mt-4">
              Our team is dedicated to providing you with the best options to maintain and upgrade your vehicle. Get the parts you need at competitive prices and with fast shipping.
            </p>
            <h2 className="text-2xl font-bold mb-6">Shipping and Returns</h2>
            <p className="mb-6">
              Shipping Policy
              We can ship to virtually any address in the world. Note that there are restrictions on some products, and some products cannot be shipped to international destinations.

              When you place an order, we will estimate shipping and delivery dates for you based on the availability of your items and the shipping options you choose.
            </p>
            <h2 className="text-2xl font-bold mb-6">Returns Policy</h2>
            <p className="mt-4">
              If you need to return an item, you may call or text  +1 617-390-7248, email  auth@bionicsautoparts.com, or chat us on this website.
              We take pride in our timely and efficient return process. We want to make sure you are taken care of every step of the way, even after the transaction is completed if needed. Please keep in mind that while we may refund your credit card within 1-2 days of the part being returned, it may take the credit card processor an additional 3-5 business days to actually process that refund to your card.
            </p>
            <p className="mt-4">
              <a
                href="/files/warranty.pdf"
                target="_blank"
                className="text-blue-600 underline hover:text-blue-800"
                rel="noopener noreferrer"
              >
                Terms and Conditions (PDF)
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 p-10 rounded-md">
            <Image
              src="/mainpage1.jpg"
              alt="Car Part 1"
              width={250}
              height={150}
              className="rounded-md w-full"
            />
            <Image
              src="/mainpage2.jpg"
              alt="Car Part 2"
              width={250}
              height={150}
              className="rounded-md w-full"
            />
            <Image
              src="/mainpage3.jpg"
              alt="Car Part 3"
              width={250}
              height={150}
              className="rounded-md w-full"
            />
            <Image
              src="/mainpage4.jpg"
              alt="Car Part 4"
              width={250}
              height={150}
              className="rounded-md w-full"
            />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Our Car Parts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-md shadow-md flex flex-col h-full">
              <div className="h-60 overflow-hidden">
                <Image
                  src="/cardmpageengine.jpg"
                  alt="Part 1"
                  width={500}
                  height={300}
                  className="object-cover rounded-md w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mt-4">Engine Parts</h3>
              <p className="text-gray-700 mt-2 flex-grow">
                Browse a wide selection of high-performance engine components that will keep your vehicle running smoothly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-md shadow-md flex flex-col h-full">
              <div className="h-60 overflow-hidden">
                <Image
                  src="/cardinteriormpage.jpg"
                  alt="Part 2"
                  width={500}
                  height={300}
                  className="object-cover rounded-md w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mt-4">Body Parts</h3>
              <p className="text-gray-700 mt-2 flex-grow">
                Find everything from bumpers to fenders to give your car a fresh new look.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-md shadow-md flex flex-col h-full">
              <div className="h-60 overflow-hidden">
                <Image
                  src="/cardcarpartsmpage.jpg"
                  alt="Part 3"
                  width={500}
                  height={300}
                  className="object-cover rounded-md w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold mt-4">Interior Accessories</h3>
              <p className="text-gray-700 mt-2 flex-grow">
                Upgrade your car's interior with stylish and functional accessories.
              </p>
            </div>
          </div>
        </div>


        {/* Testimonials Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-md shadow-md text-center">
              <p className="text-gray-700 italic">
                "I recently purchased a part for my project, and I couldn't be more satisfied. The quality is outstanding, and it fits perfectly. The ordering process was smooth, and it arrived on time. Highly recommend this part to anyone in need!"
              </p>
              <p className="text-blue-500 font-bold mt-4">- Jay</p>
              <p className="text-blue-500 font-bold mt-4">-Ford F350-</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-md shadow-md text-center">
              <p className="text-gray-700 italic">
                "I found the exact part I needed in no time! The service was quick and reliable, making my repair process so much easier."
              </p>
              <p className="text-blue-500 font-bold mt-4">- Brenda</p>
              <p className="text-blue-500 font-bold mt-4">-Dodge Charger-</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-md shadow-md text-center">
              <p className="text-gray-700 italic">
                "An excellent service when it comes to "Used car spare parts"."
              </p>
              <p className="text-blue-500 font-bold mt-4">- Damien</p>
              <p className="text-blue-500 font-bold mt-4">-Chevy S10-</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
