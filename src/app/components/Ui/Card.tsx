"use client"

import React, { useRef, useState, useEffect } from "react"
import {
  Calendar,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  Hash,
} from "lucide-react"

interface SubmissionCardProps {
  variant: "submission"
  name: string
  contact: string
  email: string
  zipCode: string
  searchedPartFormatted: string
  orderId: string
  createdAt: string
  status: string
  onStatusChange: (newStatus: string) => void
  id: string
  handleImageUpload?: (
    e: React.ChangeEvent<HTMLInputElement>,
    submissionId: string,
    status: string
  ) => void
  className?: string
  partImageUrl?: string // for single-image legacy support
  partImageUrls?: string[] // preferred: array of image URLs
}

type CardProps = SubmissionCardProps

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 border-green-300"
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-300"
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
  }
}

const getBadgeColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-500 text-white"
    case "Rejected":
      return "bg-red-500 text-white"
    default:
      return "bg-yellow-500 text-white"
  }
}

const SubmissionCard: React.FC<CardProps> = (props) => {
  const {
    variant,
    className = "",
    name,
    contact,
    email,
    zipCode,
    searchedPartFormatted,
    orderId,
    createdAt,
    status,
    onStatusChange,
    id,
    handleImageUpload,
    partImageUrl,
    partImageUrls = [],
  } = props

  // Merge single legacy URL + array
  const images = React.useMemo(() => {
    const arr = [...(partImageUrls || [])]
    if (partImageUrl && !arr.includes(partImageUrl)) arr.unshift(partImageUrl)
    return arr
  }, [partImageUrl, partImageUrls])

  const [index, setIndex] = useState(0)
  const thumbRef = useRef<HTMLDivElement | null>(null)
  const mainImgRef = useRef<HTMLImageElement | null>(null)

  // Prev/Next main image
  const prev = () => setIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0))
  const next = () => setIndex((i) => (images.length ? (i + 1) % images.length : 0))


  // Ensure selected thumbnail is visible in view
  useEffect(() => {
    const container = thumbRef.current
    if (!container || images.length === 0) return
    const selected = container.querySelector<HTMLDivElement>(`div[data-thumb-index='${index}']`)
    if (selected) {
      const selLeft = selected.offsetLeft
      const selRight = selLeft + selected.offsetWidth
      const viewLeft = container.scrollLeft
      const viewRight = viewLeft + container.clientWidth

      if (selLeft < viewLeft) {
        container.scrollTo({ left: selLeft - 8, behavior: "smooth" })
      } else if (selRight > viewRight) {
        container.scrollTo({ left: selRight - container.clientWidth + 8, behavior: "smooth" })
      }
    }
  }, [index, images.length])

  // Touch swipe support for main image
  useEffect(() => {
    const imgEl = mainImgRef.current
    if (!imgEl) return

    let startX = 0
    let endX = 0

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }
    const onTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX
    }
    const onTouchEnd = () => {
      const delta = endX - startX
      const threshold = 40 // px to consider swipe
      if (Math.abs(delta) > threshold) {
        if (delta > 0) prev()
        else next()
      }
      startX = 0
      endX = 0
    }

    imgEl.addEventListener("touchstart", onTouchStart)
    imgEl.addEventListener("touchmove", onTouchMove)
    imgEl.addEventListener("touchend", onTouchEnd)

    return () => {
      imgEl.removeEventListener("touchstart", onTouchStart)
      imgEl.removeEventListener("touchmove", onTouchMove)
      imgEl.removeEventListener("touchend", onTouchEnd)
    }
  }, [images.length])

  if (variant !== "submission") return null

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(status)}`}>
            {status || "Pending"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-600">Contact:</span>
              <span className="text-gray-900">{contact}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-600">Email:</span>
              <span className="text-gray-900 truncate">{email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-600">Zip Code:</span>
              <span className="text-gray-900">{zipCode}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-600">Order ID:</span>
              <span className="text-gray-900 font-mono">{orderId}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-600">Created:</span>
              <span className="text-gray-900">{createdAt}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <Package className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium text-gray-600">Part Information:</span>
              <p className="text-gray-900 mt-1 bg-gray-50 p-2 rounded text-xs font-mono whitespace-pre-wrap">
                {searchedPartFormatted}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        {/* Status & Image */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Update Status</label>
            <select
              value={status || "Pending"}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`w-full p-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                status
              )}`}
            >
              <option value="Pending">🟡 Pending</option>
              <option value="Approved">🟢 Approved</option>
              <option value="Rejected">🔴 Rejected</option>
            </select>
          </div>

          {/* Image carousel if images exist */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="relative w-full">
                <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  <img
                    ref={mainImgRef}
                    src={images[index]}
                    alt={`Part ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />
                </div>

                {/* Main prev/next */}
                {/* {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1 shadow"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 rounded-full p-1 shadow"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )} */}
              </div>

              {/* Thumbnails scroller */}
              {/* <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollThumbs("left")}
                  className="p-1 rounded bg-white/90 shadow"
                  aria-label="Scroll thumbnails left"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>

                <div
                  ref={thumbRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {images.map((src, i) => (
                    <div
                      key={i}
                      data-thumb
                      data-thumb-index={i}
                      onClick={() => goTo(i)}
                      className={`flex-shrink-0 rounded-md overflow-hidden cursor-pointer border ${i === index ? "ring-2 ring-blue-500" : "border-transparent"}`}
                      style={{ width: 96, height: 56 }} // thumbnail fixed size
                    >
                      <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => scrollThumbs("right")}
                  className="p-1 rounded bg-white/90 shadow"
                  aria-label="Scroll thumbnails right"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </div> */}
            </div>
          )}

          {/* Upload control (always visible) */}
          <div className="flex items-center justify-between gap-2">
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer text-gray-700">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (handleImageUpload) handleImageUpload(e, id, status)
                  setIndex(0)
                }}
                className="hidden"
              />
              <span className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Upload / Add</span>
            </label>

            {images.length > 0 && (
              <button
                type="button"
                onClick={() => window.open(images[index], "_blank")}
                className="text-sm text-gray-600 underline"
              >
                View full
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionCard
