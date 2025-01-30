"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ArrowRight } from 'lucide-react';

export default function Contact() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    } catch (error) {
      console.log("Error occurred", error);
      setResponseMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed "
      style={{ backgroundImage: "url('/mainbgengine.jpg')", backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-2xl text-white max-w-3xl mx-auto">
            We're here to help with any questions, comments, or concerns you may have.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6 flex items-center">
              <MessageCircle className="mr-2" />
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-4 w-4" />
              </button>
            </form>
            {responseMessage && (
              <p className="mt-4 text-center text-gray-600">{responseMessage}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6 flex items-center">
              <Phone className="mr-2" />
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p><a href="mailto:auth@bionicsautoparts.com" className="text-blue-600 hover:underline">Scott@bionicsautoparts.com</a> (Shipping & Tracking,Invoice Queries)
                  </p>
                  <p><a href="mailto:parts@bionicsautoparts.com" className="text-blue-600 hover:underline">parts@bionicsautoparts.com</a> (Parts Needs)</p>
                  <p><a href="mailto:invoice@bionicsautoparts.com" className="text-blue-600 hover:underline">bionicsautoparts@usa.com</a> (For all of the above)</p>
                  <p><a href="mailto:support@bionicsautoparts.com" className="text-blue-600 hover:underline">john@bionicsautoparts.com</a> (Support)</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="font-semibold pr-8">Phone</h3>
                <div className="pr-8">
                  {/* <h3 className="font-semibold">Phone</h3> */}
                  <p><a href="tel:+16173907248" className="text-blue-600 hover:underline">+1 617-390-7248</a></p>
                  <p><a href="tel:+16174656087" className="text-blue-600 hover:underline">+1 617-465-6087</a></p>
                  <p>Howard St #1, Quincy, MA 02169</p>
                </div>
                <div className="pl-8">
                  {/* <h3 className="font-semibold">Phone</h3> */}
                  <p><a href="tel:+16173907248" className="text-blue-600 hover:underline">+1 773 773 9035</a></p>
                  <p><a href="tel:+16174656087" className="text-blue-600 hover:underline">+1 872-465-0393</a></p>
                  <p>W North Ave, Chicago, IL 60639</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p>6332 Deep Canyon Dr,Beverly Hills,CA 90210</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold">Business Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Section */}
        <section className="mt-16 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-8 flex items-center justify-center">
            <MapPin className="mr-2" />
            Find Us Here
          </h2>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093743!2d-122.41941548468034!3d37.77492927975969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064fcd0d755%3A0xe019c88c141f8f72!2s6322%20Deep%20Canyon%20Dr!5e0!3m2!1sen!2sus!4v1642998001515!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Google Map of Deep Canyon Dr"
            ></iframe>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-16 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Ready to Find Your Part?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our wide selection of high-quality auto parts at unbeatable prices.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition duration-300 ease-in-out"
          >
            Buy Our Parts
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </section>
      </div>
    </div>
  );
}

