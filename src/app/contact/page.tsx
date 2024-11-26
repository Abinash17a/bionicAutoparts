"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Contact() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message);
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.message || "An error occurred. Please try again.");
      }
    } catch (error:any) {
      console.log("Error occured",error)
      setResponseMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/mainbgengine.jpg')" }}
    >
      <section className="container mx-auto px-6 py-8 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
        <p className="mt-2 text-center">
          Get in touch with us for any inquiries or support.
        </p>

        <div className="flex flex-col md:flex-row md:justify-between mt-8">
          {/* Left Side: Get in Touch */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p className="mt-2">
              We would love to hear from you! Please reach out with any
              questions, comments, or concerns.
            </p>
            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
            {responseMessage && (
              <p className="mt-4 text-center text-gray-600">{responseMessage}</p>
            )}
          </div>

          {/* Right Side: Contact Information */}
          <div className="w-full md:w-1/2 md:pl-8">
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Shipping & Tracking:</strong>{" "}
                <a
                  href="mailto:auth@bionicsautoparts.com"
                  className="text-blue-600"
                >
                  auth@bionicsautoparts.com
                </a>
              </li>
              <li>
                <strong>Email for Parts Needs:</strong>{" "}
                <a
                  href="mailto:parts@bionicsautoparts.com"
                  className="text-blue-600"
                >
                  parts@bionicsautoparts.com
                </a>
              </li>
              <li>
                <strong>Invoice Queries:</strong>{" "}
                <a
                  href="mailto:invoice@bionicsautoparts.com"
                  className="text-blue-600"
                >
                  invoice@bionicsautoparts.com
                </a>
              </li>
              <li>
                <strong>Support:</strong>{" "}
                <a
                  href="mailto:support@bionicsautoparts.com"
                  className="text-blue-600"
                >
                  support@bionicsautoparts.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a href="tel:+16173907248" className="text-blue-600">
                  +1 617-390-7248
                </a>
                ,{" "}
                <a href="tel:+16174656087" className="text-blue-600">
                  +1 617-465-6087
                </a>
              </li>
              <li>
                <strong>Office Address:</strong> 6322 Deep Canyon Dr
              </li>
            </ul>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="mt-12 pb-8">
          <h2 className="text-2xl font-semibold text-center">Find Us Here</h2>
          <div className="mt-4 bg-gray-100 rounded-lg shadow-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093743!2d-122.41941548468034!3d37.77492927975969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064fcd0d755%3A0xe019c88c141f8f72!2s6322%20Deep%20Canyon%20Dr!5e0!3m2!1sen!2sus!4v1642998001515!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Google Map of Deep Canyon Dr"
            ></iframe>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Visit us for all your needs!
          </p>
        </div>

        {/* Buy Our Parts Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Buy Our Parts
          </button>
        </div>
      </section>
    </div>
  );
}
