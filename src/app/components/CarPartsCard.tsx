"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Fuel as Engine, Car, Sofa } from "lucide-react"

export const CarPartsCardsSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
    }),
  }

  const cardData = [
    {
      title: "Engine Parts",
      description: "High-performance components for smooth vehicle operation.",
      image: "/cardmpageengine.jpg",
      icon: <Engine className="h-5 w-5" />,
      color: "bg-orange-500",
    },
    {
      title: "Body Parts",
      description: "Bumpers, fenders, and more for a refreshed look.",
      image: "/cardinteriormpage.jpg",
      icon: <Car className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      title: "Interior Accessories",
      description: "Stylish upgrades for comfort and functionality.",
      image: "/cardcarpartsmpage.jpg",
      icon: <Sofa className="h-5 w-5" />,
      color: "bg-emerald-500",
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 sm:text-4xl">
          Premium Car Parts
        </h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          High-quality components for performance, style, and comfort.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-full mx-auto px-4 sm:px-8 md:px-0 lg:px-48">
        {cardData.map((card, index) => (
          <Link href="/parts" passHref legacyBehavior>
            <motion.a
              key={card.title}
              custom={index}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 block focus:outline-none"
              tabIndex={0}
            >
              <div className="relative h-48 sm:h-56 w-100">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className={`${card.color} absolute top-3 left-3 p-2 rounded-full text-white`}>
                  {card.icon}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{card.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-700 hover:text-blue-900">
                  Explore
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.a>
          </Link>
        ))}
      </div>
    </section>
  )
}

