export default function AboutUs() {
  return (
    <section className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">About Us</h1>
      <p className="mt-2 text-center text-lg">We are the best car parts provider in the industry!</p>

      <div className="flex flex-col md:flex-row mt-8">
        {/* Left Side: About the Company */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold">About Our Company</h2>
          <p className="mt-4 text-lg">
            Our Huge Inventory and Computerized Search Network
            We encourage you to contact us at any time that you are looking for used auto parts. Our inventory is organized and coded, so we can look up parts for you in seconds on our computers. We also have access to the Computerized Search Network that is connected to over affiliated recycling centers.
          </p>
        </div>

        {/* Right Side: Large Image */}
        <div className="w-full md:w-1/2 md:pl-8">
          <img
            src="/aboutusmain.jpg"
            alt="About Us"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Mission Statement */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p className="mt-4 text-lg">
          Our mission is to provide the best quality auto parts at competitive prices while ensuring customer satisfaction through our dedicated service.
        </p>
      </div>

      {/* Fancy Bottom Section */}
      <div className="mt-12 text-center bg-gray-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Join Our Community!</h2>
        <p className="mt-4">
          Sign up for our newsletter and stay updated with the latest news, promotions, and tips for maintaining your vehicle. Together, we can keep your car running smoothly!
        </p>
        <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition duration-300">
          Subscribe Now
        </button>
      </div>
    </section>
  );
}
