"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Quote, Star, ChevronRight, ChevronLeft } from "lucide-react"

export const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024) // lg breakpoint
      console.log(isDesktop)
    }

    checkMobile()
    checkScreenSize()
    window.addEventListener("resize", () => {
      checkMobile()
      checkScreenSize()
    })

    return () => window.removeEventListener("resize", () => {
      checkMobile()
      checkScreenSize()
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isMobile])

  const testimonials = [
    {
      text: "I recently purchased a part for my project, and I couldn't be more satisfied. The quality is outstanding, and it fits perfectly. The ordering process was smooth, and it arrived on time. Highly recommend this part to anyone in need!",
      name: "Jay",
      car: "Ford F350",
      rating: 5,
      initials: "JD",
      color: "bg-gradient-to-br from-blue-500 to-cyan-400",
    },
    {
      text: "I found the exact part I needed in no time! The service was quick and reliable, making my repair process so much easier.",
      name: "Brenda",
      car: "Dodge Charger",
      rating: 5,
      initials: "BM",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      text: "An excellent service when it comes to 'Used car spare parts'.",
      name: "Damien",
      car: "Chevy S10",
      rating: 4,
      initials: "DK",
      color: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
  ]

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
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

      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-full mx-auto lg:px-48 sm:px-12 md:px-0 ">
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
      <div className="md:hidden">
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

