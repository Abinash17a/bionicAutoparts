"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Users,
  Star,
} from "lucide-react"

export default function Contact() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [responseMessage, setResponseMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const responseData = await response.json()
        setResponseMessage(responseData.message)
        setFormData({ name: "", email: "", message: "" })
        setIsSuccess(true)
      } else {
        const errorData = await response.json()
        setResponseMessage(errorData.message || "An error occurred. Please try again.")
        setIsSuccess(false)
      }
    } catch (error) {
      console.log("Error occurred", error)
      setResponseMessage("An error occurred. Please try again.")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      items: [
        { label: "Shipping & Tracking", value: "Scott@bionicsautoparts.com", type: "email" },
        { label: "Parts Inquiries", value: "parts@bionicsautoparts.com", type: "email" },
        { label: "General Support", value: "bionicsautoparts@usa.com", type: "email" },
        { label: "Technical Support", value: "john@bionicsautoparts.com", type: "email" },
      ],
    },
    {
      icon: Phone,
      title: "Phone Support",
      items: [
        { label: "Main Line", value: "+1 617-390-7248", type: "phone" },
        { label: "Parts Hotline", value: "+1 617-465-6087", type: "phone" },
      ],
    },
  ]

  const locations = [
    {
      name: "Beverly Hills Office",
      address: "6332 Deep Canyon Dr, Beverly Hills, CA 90210",
      type: "Headquarters",
    },
    {
      name: "Quincy Warehouse",
      address: "Howard St #1, Quincy, MA 02169",
      type: "Distribution Center",
    },
    {
      name: "Chicago Branch",
      address: "W North Ave, Chicago, IL 60639",
      type: "Regional Office",
    },
  ]

  const features = [
    {
      icon: Zap,
      title: "Fast Response",
      description: "Get replies within 2 hours during business hours",
      color: "bg-blue-600",
    },
    {
      icon: Shield,
      title: "Secure Communication",
      description: "Your information is protected with enterprise-grade security",
      color: "bg-blue-600",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Talk to automotive specialists who understand your needs",
      color: "bg-blue-600",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-blue-100 rounded-full px-6 py-2 mb-6">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">24/7 Support Available</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-800">Let's Connect</h1>

            <p className="text-xl md:text-2xl text-blue-600 mb-8 leading-relaxed">
              Ready to find the perfect auto part? Our expert team is here to help you every step of the way.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">{feature.title}</h3>
                  <p className="text-blue-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-800">Send Us a Message</h2>
                <p className="text-blue-600">We'll get back to you within 2 hours</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-blue-800 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-800 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-blue-800 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us about the part you're looking for or any questions you have..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {responseMessage && (
              <div
                className={`mt-4 p-3 rounded-lg flex items-center ${
                  isSuccess ? "bg-green-100 border border-green-300 text-green-800" : "bg-red-100 border border-red-300 text-red-800"
                }`}
              >
                {isSuccess ? <CheckCircle className="w-5 h-5 mr-2" /> : <MessageCircle className="w-5 h-5 mr-2" />}
                {responseMessage}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Methods */}
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800">{method.title}</h3>
                </div>

                <div className="space-y-3">
                  {method.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-600 text-sm">{item.label}</p>
                      <a
                        href={item.type === "email" ? `mailto:${item.value}` : `tel:${item.value}`}
                        className="text-blue-800 hover:text-blue-600 font-medium transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-blue-800">Business Hours</h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-blue-600">Monday - Friday</span>
                  <span className="text-blue-800 font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-blue-600">Saturday</span>
                  <span className="text-blue-800 font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-blue-600">Sunday</span>
                  <span className="text-blue-800 font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-800 mb-2">Our Locations</h2>
          <p className="text-xl text-blue-600">Find us across multiple cities to serve you better</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                <div>
                  <h3 className="text-xl font-bold text-blue-800">{location.name}</h3>
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">{location.type}</span>
                </div>
              </div>
              <p className="text-blue-600">{location.address}</p>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-2xl font-bold text-blue-800">Find Us on the Map</h3>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093743!2d-122.41941548468034!3d37.77492927975969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064fcd0d755%3A0xe019c88c141f8f72!2s6322%20Deep%20Canyon%20Dr!5e0!3m2!1sen!2sus!4v1642998001515!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Google Map of Deep Canyon Dr"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>

            <h2 className="text-4xl font-bold text-blue-800 mb-4">Ready to Find Your Perfect Part?</h2>
            <p className="text-xl text-blue-600 mb-6 leading-relaxed">
              Join thousands of satisfied customers who trust us for premium auto parts at unbeatable prices. Experience
              the difference quality makes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="group inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all duration-300"
              >
                Shop Auto Parts
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="inline-flex items-center px-6 py-3 border-2 border-blue-600 rounded-lg text-blue-800 font-semibold hover:bg-blue-100 transition-all duration-300">
                <Phone className="mr-2 w-5 h-5" />
                Call Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

