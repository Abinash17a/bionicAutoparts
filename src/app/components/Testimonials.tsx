"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)
  const isVisible = useInView(sectionRef, { once: true, amount: 0.2 })

  const testimonials = [
    {
      name: "Sarah Mitchell",
      car: "2018 Honda Civic",
      text: "Found the exact brake pads I needed at an unbeatable price. The quality exceeded my expectations and they arrived faster than promised. Will definitely be ordering again!",
      rating: 5,
      initials: "SM",
      color: "bg-blue-500"
    },
    {
      name: "Mike Rodriguez",
      car: "2015 Ford F-150",
      text: "Their engine parts selection is incredible. I was able to restore my truck to peak performance with genuine OEM parts at fraction of dealer prices. Excellent customer service too.",
      rating: 5,
      initials: "MR",
      color: "bg-green-500"
    },
    {
      name: "Jennifer Chen",
      car: "2020 Toyota Camry",
      text: "Quick delivery and perfect fit! The headlight assembly was exactly what I needed. The packaging was secure and the installation was straightforward. Highly recommend!",
      rating: 5,
      initials: "JC",
      color: "bg-purple-500"
    },
    {
      name: "David Thompson",
      car: "2017 BMW 3 Series",
      text: "Premium parts at affordable prices. The air filter and oil filter combo saved me money compared to local shops. Quality is top-notch and shipping was lightning fast.",
      rating: 5,
      initials: "DT",
      color: "bg-red-500"
    },
    {
      name: "Lisa Wang",
      car: "2019 Nissan Altima",
      text: "Amazing experience! The suspension components transformed my car's ride quality. Professional packaging and detailed installation guides made the process smooth.",
      rating: 5,
      initials: "LW",
      color: "bg-yellow-500"
    },
    {
      name: "Robert Johnson",
      car: "2016 Chevrolet Silverado",
      text: "Best place for truck parts online. Found rare transmission components that local dealers couldn't source. Fair pricing and genuine parts make this my go-to supplier.",
      rating: 5,
      initials: "RJ",
      color: "bg-indigo-500"
    }
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  }

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div ref={sectionRef} className="py-24 px-6 lg:px-20 bg-gradient-to-b from-gray-50 to-white sm:px-12 ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4 text-gray-900 tracking-tight">
          What Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
            Customers Say
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real feedback from car enthusiasts who have found the perfect parts for their vehicles
        </p>
      </motion.div>

      {/* Desktop/Tablet View */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-full mx-auto lg:px-48 sm:px-12 md:px-0 ">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-8 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1">
                <div className={`h-full w-24 ${testimonial.color}`}></div>
              </div>

              <Quote className="text-gray-200 h-12 w-12 absolute top-6 right-6 rotate-180" />

              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>

              <p className="text-gray-700 relative z-10 mb-6 leading-relaxed">{testimonial.text}</p>

              <div className="flex items-center mt-6">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm border-2 border-white ${testimonial.color}`}
                >
                  {testimonial.initials}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.car}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile View - Carousel */}
      <div className="sm:hidden">
        <div className="relative px-4">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex"
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg p-6 relative">
                    <div className="absolute top-0 left-0 w-full h-1">
                      <div className={`h-full w-24 ${testimonial.color}`}></div>
                    </div>

                    <Quote className="text-gray-200 h-8 w-8 absolute top-4 right-4 rotate-180" />

                    <div className="flex space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 relative z-10 mb-6 text-sm leading-relaxed">{testimonial.text}</p>

                    <div className="flex items-center mt-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm border-2 border-white ${testimonial.color}`}
                      >
                        {testimonial.initials}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                        <p className="text-gray-500 text-xs">{testimonial.car}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${activeIndex === index ? "bg-gray-800" : "bg-gray-300"
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  )
}

