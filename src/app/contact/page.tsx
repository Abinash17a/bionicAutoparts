"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Car,
} from "lucide-react";
import { ClickToRevealEmail } from "../components/ProtectedEmail";
import { contactMethods, locations, features } from "../data/contactData";

export default function Contact() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    make: "",
    model: "",
    partRequested: "",
    vin: "",
    partNumber: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
        setIsSuccess(true);
        // Successful submission redirect without leaking customer parameters into URL
        router.push("/confirmation");
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.message || "An error occurred. Please try again.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.log("Error occurred", error);
      setResponseMessage("An error occurred. Please call (617) 516-3140.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-50 py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Reconciled Support Hours Badge */}
            <div className="inline-flex items-center bg-blue-100 rounded-full px-5 py-2 mb-6">
              <MessageCircle className="w-4 h-4 mr-2 text-blue-600" />
              <span className="text-xs sm:text-sm font-semibold text-blue-800">
                Online Quotes 24/7 • Phone Support Mon–Sat 9AM–5PM ET
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-blue-900 tracking-tight">
              Contact USA Used Auto Parts
            </h1>

            <p className="text-lg md:text-xl text-blue-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Have questions about vehicle compatibility, Hollander interchange, or shipping? Our automotive parts team is here to assist.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100"
                >
                  <div className={`${feature.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-blue-900 mb-1">{feature.title}</h3>
                  <p className="text-blue-700 text-xs leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact & Fitment Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 text-white">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Send Us a Parts Inquiry</h2>
                <p className="text-slate-500 text-sm">We respond quickly during business hours</p>
              </div>
            </div>

            <form method="POST" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="(617) 516-3140"
                />
              </div>

              {/* Optional Automotive Specific Fields */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Car className="w-4 h-4 text-blue-600" />
                  <span>Vehicle Information (Optional for Accurate Fitment)</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Year (e.g. 2018)"
                    className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-950 bg-white"
                  />
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="Make (e.g. Toyota)"
                    className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-950 bg-white"
                  />
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Model (e.g. Camry)"
                    className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-950 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="partRequested"
                    value={formData.partRequested}
                    onChange={handleChange}
                    placeholder="Part Name (e.g. Engine Assembly)"
                    className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-950 bg-white"
                  />
                  <input
                    type="text"
                    name="vin"
                    maxLength={17}
                    value={formData.vin}
                    onChange={handleChange}
                    placeholder="VIN (17-digits)"
                    className="px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-950 bg-white uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Message or Part Specifications *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Tell us about the auto part you need, transmission code, shipping zip code, etc."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Message...
                  </>
                ) : (
                  <>
                    Submit Message (No URL Query Leak)
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {responseMessage && (
              <div
                className={`mt-4 p-3 rounded-lg flex items-center text-sm ${
                  isSuccess
                    ? "bg-green-100 border border-green-300 text-green-800"
                    : "bg-red-100 border border-red-300 text-red-800"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle className="w-5 h-5 mr-2 shrink-0" />
                ) : (
                  <MessageCircle className="w-5 h-5 mr-2 shrink-0" />
                )}
                {responseMessage}
              </div>
            )}
          </div>

          {/* Contact Information & Hours */}
          <div className="space-y-6">
            {/* Contact Methods */}
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white">
                    <method.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{method.title}</h3>
                </div>

                <div className="space-y-2.5">
                  {method.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      {item.type === "email" ? (
                        <div>
                          <p className="text-slate-500 text-xs mb-1">{item.label}</p>
                          <ClickToRevealEmail
                            email={item.value}
                            label="Click to reveal email"
                            className="w-full text-sm text-blue-600 font-semibold"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-slate-500 text-xs mb-0.5">{item.label}</p>
                          <a
                            href={`tel:${item.value.replace(/\s/g, "")}`}
                            className="text-slate-900 hover:text-blue-600 font-bold transition-colors flex items-center gap-2 text-sm"
                          >
                            <Phone className="w-4 h-4 text-blue-600" />
                            {item.value}
                          </a>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Reconciled Business Hours */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 text-white">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Support Hours</h3>
                  <p className="text-xs text-slate-500">Eastern Time (ET)</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">Monday - Friday</span>
                  <span className="text-slate-900 font-bold">9:00 AM - 5:00 PM ET</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">Saturday</span>
                  <span className="text-slate-900 font-bold">10:00 AM - 2:00 PM ET</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-600 font-medium">Sunday</span>
                  <span className="text-slate-500 font-semibold">Closed (Online Form Monitored)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations & Map Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Our Locations</h2>
          <p className="text-slate-600 text-sm">Corporate office and regional warehouse distribution centers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{location.name}</h3>
                  <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                    {location.type}
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-sm mt-2">{location.address}</p>
            </div>
          ))}
        </div>

        {/* Reconciled Beverly Hills Google Map */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-8">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-xl font-bold text-slate-900">Headquarters Map (Beverly Hills, CA)</h3>
          </div>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=6332+Deep+Canyon+Dr,+Beverly+Hills,+CA+90210&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Google Map of Beverly Hills Headquarters"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
              ))}
            </div>

            <h2 className="text-3xl font-extrabold text-blue-900 mb-3">
              Ready to Order Tested Recycled Auto Parts?
            </h2>
            <p className="text-blue-700 text-base mb-6 leading-relaxed">
              Join thousands of mechanics, collision shops, and car owners nationwide who trust USA Used Auto Parts for genuine recycled OEM components.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/parts")}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm"
              >
                Browse All Categories
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>

              <a
                href="tel:16175163140"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 rounded-xl text-blue-900 font-bold hover:bg-blue-100 transition-all"
              >
                <Phone className="mr-2 w-4 h-4 text-blue-600" />
                Call (617) 516-3140
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
