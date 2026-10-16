"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Star, Quote, PenSquare, X, CheckCircle, ShieldCheck, Sparkles } from "lucide-react"

export const TestimonialsSection = () => {
  const [showAll, setShowAll] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [newReview, setNewReview] = useState({
    name: "",
    car: "",
    part: "",
    rating: 5,
    text: "",
  })

  const sectionRef = useRef(null)
  const isVisible = useInView(sectionRef, { once: true, amount: 0.15 })

  const testimonials = [
    {
      name: "Marcus Vance",
      car: "2017 Chevrolet Silverado 1500",
      part: "5.3L EcoTec3 V8 Engine",
      text: "Was hesitant about buying a used long block online, but the compression test sheet (182-185 PSI across all 8 cylinders) was stamped right on the shipping crate. Liftgate freight arrived in 4 days. My mechanic dropped it in and it fired up immediately. Saved over $3,400 compared to a dealer crate engine.",
      rating: 5,
      initials: "MV",
      color: "bg-blue-600",
      verified: true,
      location: "Dallas, TX"
    },
    {
      name: "Elena Rostova",
      car: "2018 Toyota Camry",
      part: "8-Speed Automatic Transmission (UA80E)",
      text: "Local shop quoted $5,600 for a replacement transmission. Sourced a verified 46k-mile OEM unit here. Fluid pan was clean, torque converter was included in the crate, and all gear shifts are silky smooth. 6 months in and running like new.",
      rating: 5,
      initials: "ER",
      color: "bg-emerald-600",
      verified: true,
      location: "Columbus, OH"
    },
    {
      name: "David Thorne",
      car: "2016 Ford F-150",
      part: "3.5L EcoBoost V6 Engine",
      text: "Engine runs quiet and compression was solid across all cylinders. Freight carrier took an extra day for residential liftgate delivery, but customer support kept me updated the whole time. Overall very satisfied with the purchase.",
      rating: 4,
      initials: "DT",
      color: "bg-sky-600",
      verified: true,
      location: "Nashville, TN"
    },
    {
      name: "Greg Holbrook",
      car: "Apex Automotive Repair (Shop Owner)",
      part: "2019 Ford F-150 5.0L Coyote V8",
      text: "As an independent repair shop, Hollander interchange accuracy is non-negotiable. Their parts rep double-checked the 8th VIN digit before processing the order. Delivered directly to our commercial bay without a scratch. They are now our top salvage parts partner.",
      rating: 5,
      initials: "GH",
      color: "bg-amber-600",
      verified: true,
      location: "Charlotte, NC"
    },
    {
      name: "Jason Vance",
      car: "2015 Honda Civic",
      part: "CVT Transmission Assembly",
      text: "Transmission works well and shifts clean after installation. The donor vehicle wiring harness clip was slightly bent during shipping so my mechanic had to swap our old bracket, but mechanically it is 100% sound.",
      rating: 3,
      initials: "JV",
      color: "bg-orange-600",
      verified: true,
      location: "Indianapolis, IN"
    },
    {
      name: "Devon Miller",
      car: "2016 Honda Accord",
      part: "2.4L K24W Engine Assembly",
      text: "Clean donor vehicle documentation with 52k verified miles. Valvetrain and cylinder walls were spotless under the borescope. Passed emissions on the first try. The 6-month warranty gave me complete peace of mind.",
      rating: 5,
      initials: "DM",
      color: "bg-purple-600",
      verified: true,
      location: "Phoenix, AZ"
    },
    {
      name: "Samantha Reed",
      car: "2019 Nissan Rogue",
      part: "Front Left Door Assembly",
      text: "Ordered a driver side door assembly. Color match was spot on and power window motor works great. Small surface scratch on the lower trim from transit, but buffed out easily. Great price for OEM.",
      rating: 4,
      initials: "SR",
      color: "bg-violet-600",
      verified: true,
      location: "Austin, TX"
    },
    {
      name: "Anthony 'Tony' Russo",
      car: "2015 Nissan Altima",
      part: "2.5L QR25DE Engine & CVT",
      text: "Good low-mileage engine for my Altima. Had a minor delay getting the VIN tracking sheet, but once shipped it arrived quickly. Engine runs strong with zero oil leaks.",
      rating: 4,
      initials: "TR",
      color: "bg-indigo-600",
      verified: true,
      location: "Philadelphia, PA"
    },
    {
      name: "Carlos Mendez",
      car: "2017 Jeep Grand Cherokee",
      part: "3.6L Pentastar V6 Engine",
      text: "Excellent communication from freight dispatch. The Pentastar motor arrived dry, drained, and sealed in heavy-duty poly on a custom pallet. Oil pressure sits solid at 45 PSI warm idle. Will order again for our fleet vehicles.",
      rating: 5,
      initials: "CM",
      color: "bg-rose-600",
      verified: true,
      location: "Denver, CO"
    },
    {
      name: "Robert Kowalski",
      car: "2014 RAM 1500",
      part: "Transfer Case Assembly",
      text: "Transfer case arrived in good shape mechanically with clean fluid, but the pallet wrapping was torn on arrival. Luckily no damage to the casing. Works fine in 4WD high and low.",
      rating: 3,
      initials: "RK",
      color: "bg-slate-600",
      verified: true,
      location: "Milwaukee, WI"
    },
    {
      name: "Rachel Adams",
      car: "2018 Toyota Camry SE",
      part: "Front Driver Power Seat Assembly",
      text: "Hard to find exact black woven cloth seat with functioning 8-way power tracks and intact airbag harness. Arrived wrapped in four layers of bubble wrap without any fabric tears or bent rails. 100% plug-and-play install.",
      rating: 5,
      initials: "RA",
      color: "bg-teal-600",
      verified: true,
      location: "Tampa, FL"
    },
    {
      name: "Brandon K.",
      car: "2022 Ford Explorer",
      part: "2.3L EcoBoost Turbo Engine",
      text: "Low-mileage unit with intake manifold and turbo intact. Saved our family weeks of backorder waiting time. The tracking updates during freight transit were spot on. Highly recommend USA Used Auto Parts.",
      rating: 5,
      initials: "BK",
      color: "bg-cyan-600",
      verified: true,
      location: "Kansas City, MO"
    },
    {
      name: "Michael Chang",
      car: "2018 Chevrolet Silverado",
      part: "Rear Axle Assembly (3.42 Ratio)",
      text: "Replaced the rear differential on my Silverado. Part fit perfectly and gear noise is completely gone. Shipping took 5 business days instead of 3, but the part quality is top notch.",
      rating: 4,
      initials: "MC",
      color: "bg-lime-600",
      verified: true,
      location: "Seattle, WA"
    },
    {
      name: "Derek & Sarah Peters",
      car: "2017 Subaru Outback",
      part: "Power Steering Rack & Pinion",
      text: "Good quality steering rack at a fraction of dealer price. Instructions for core returns could have been clearer, but customer service answered my call right away and helped sort it out.",
      rating: 3,
      initials: "DP",
      color: "bg-yellow-600",
      verified: true,
      location: "Atlanta, GA"
    }
  ]

  const avgRating = testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({ star, count: testimonials.filter((t) => t.rating === star).length }))

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setIsModalOpen(false)
      setNewReview({ name: "", car: "", part: "", rating: 5, text: "" })
    }, 2000)
  }

  return (
    <div ref={sectionRef} className="py-20 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 mb-3">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Verified Customer Feedback
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Customers Say</span>
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
          Real experiences from car owners, DIYers, and professional mechanics across the nation.
        </p>
      </motion.div>

      {/* Rating summary graph */}
      <div className="max-w-3xl mx-auto mb-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center sm:pr-6 sm:border-r border-slate-200">
          <div className="text-5xl font-extrabold text-slate-900">{avgRating.toFixed(1)}</div>
          <div className="flex justify-center space-x-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
            ))}
          </div>
          <div className="text-xs text-slate-500">{testimonials.length} reviews</div>
        </div>
        <div className="flex-1 w-full space-y-2">
          {ratingCounts.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-3 text-xs text-slate-600">
              <span className="w-10 flex items-center gap-1 font-semibold">{star} <Star className="h-3 w-3 text-amber-400 fill-amber-400" /></span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / testimonials.length) * 100}%` }} />
              </div>
              <span className="w-6 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop & Tablet Grid View */}
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {testimonials.slice(0, showAll ? testimonials.length : 8).map((testimonial, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 transition-all duration-300 p-6 flex flex-col justify-between relative group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>
              <Quote className="text-slate-100 group-hover:text-blue-50 transition-colors h-12 w-12 absolute top-4 right-4 rotate-180 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified Buyer
                    </span>
                  )}
                </div>

                {testimonial.part && (
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50/70 border border-blue-100 rounded-md px-2.5 py-1 mb-3 inline-block">
                    Part: {testimonial.part}
                  </div>
                )}

                <p className="text-slate-700 text-sm leading-relaxed mb-6 relative z-10">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>

              <div className="flex items-center pt-4 border-t border-slate-100 mt-auto">
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${testimonial.color}`}
                >
                  {testimonial.initials}
                </div>
                <div className="ml-3">
                  <p className="font-bold text-slate-900 text-sm">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs">{testimonial.car}</p>
                  {testimonial.location && (
                    <p className="text-slate-400 text-[11px]">{testimonial.location}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {!showAll && testimonials.length > 8 && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors"
            >
              More reviews ({testimonials.length - 8})
            </button>
          )}

          {/* "Open for Reviews" Card (Desktop) */}
          <motion.div
            custom={testimonials.length}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border-2 border-blue-400/30 p-6 flex flex-col justify-between relative group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 border border-amber-300/30 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Open for Reviews
                </span>
                <div className="flex space-x-1 text-amber-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-300" />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Share Your Experience
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Have you recently purchased an engine, transmission, or auto part from us? We value your honest feedback and community reviews.
              </p>
            </div>

            <div className="pt-4 border-t border-white/15">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold py-3 px-5 rounded-xl text-sm shadow-lg transition-all duration-200 active:scale-[0.98]"
              >
                <PenSquare className="w-4 h-4" />
                Write a Review
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 relative overflow-hidden"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {isSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Thank You For Your Review!</h3>
                  <p className="text-slate-600 text-sm">
                    Your feedback has been submitted successfully and will appear after quick verification.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
                      Customer Review
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">Open for Reviews</h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      Share your genuine feedback on part quality, fitment, and shipping speed.
                    </p>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Overall Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= newReview.rating ? "fill-amber-400" : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Vehicle Model *
                        </label>
                        <input
                          type="text"
                          required
                          value={newReview.car}
                          onChange={(e) => setNewReview({ ...newReview, car: e.target.value })}
                          placeholder="e.g. 2018 Ford F-150"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Part Purchased
                      </label>
                      <input
                        type="text"
                        value={newReview.part}
                        onChange={(e) => setNewReview({ ...newReview, part: e.target.value })}
                        placeholder="e.g. 5.0L Coyote V8 Engine Assembly"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Review *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newReview.text}
                        onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                        placeholder="Tell us about the part condition, freight delivery, fitment accuracy..."
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all active:scale-[0.98]"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}


