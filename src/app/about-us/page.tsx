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
            At Grade Auto Parts, we are committed to providing the highest quality auto parts and exceptional customer service. Our dedicated team works tirelessly to ensure that our customers have access to the parts they need to keep their vehicles running smoothly.
          </p>
          <p className="mt-4 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat. Proin eget tortor risus. Sed porttitor lectus nibh. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.
          </p>
          <p className="mt-4 text-lg">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

        {/* Right Side: Additional Information */}
        <div className="w-full md:w-1/2 md:pl-8">
          <h2 className="text-xl font-semibold">What We Offer</h2>
          <p className="mt-4 text-lg">
            We offer a wide range of auto parts including:
          </p>
          <ul className="mt-4 list-disc pl-6 text-lg">
            <li>Engine Parts</li>
            <li>Brakes and Suspension</li>
            <li>Electrical Components</li>
            <li>Body Parts</li>
            <li>Accessories and More!</li>
          </ul>
          <p className="mt-4 text-lg">
            Our team is always here to help you find exactly what you need, ensuring that your vehicle runs at its best.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold">Our Mission</h2>
        <p className="mt-4 text-lg">
          Our mission is to provide the best quality auto parts at competitive prices while ensuring customer satisfaction through our dedicated service.
        </p>
      </div>

      {/* Team Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center">Meet Our Team</h2>
        <div className="flex flex-wrap justify-center mt-6">
          <div className="bg-white shadow-lg rounded-lg p-4 mx-4 mb-4 text-center w-1/3">
            <img src="/images/team1.jpg" alt="Team Member" className="rounded-full w-32 h-32 mx-auto"/>
            <h3 className="text-lg font-semibold mt-2">John Doe</h3>
            <p className="text-sm text-gray-600">CEO</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 mx-4 mb-4 text-center w-1/3">
            <img src="/images/team2.jpg" alt="Team Member" className="rounded-full w-32 h-32 mx-auto"/>
            <h3 className="text-lg font-semibold mt-2">Jane Smith</h3>
            <p className="text-sm text-gray-600">Operations Manager</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 mx-4 mb-4 text-center w-1/3">
            <img src="/images/team3.jpg" alt="Team Member" className="rounded-full w-32 h-32 mx-auto"/>
            <h3 className="text-lg font-semibold mt-2">Emily Johnson</h3>
            <p className="text-sm text-gray-600">Customer Support</p>
          </div>
        </div>
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
