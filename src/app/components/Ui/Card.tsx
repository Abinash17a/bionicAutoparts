"use client"

import type React from "react"
import { Calendar, Mail, MapPin, Package, Phone, User, Hash } from "lucide-react"

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
  className?: string
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
  const { variant, className = "" } = props

  if (variant === "submission") {
    const { name, contact, email, zipCode, searchedPartFormatted, orderId, createdAt, status, onStatusChange } = props

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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Update Status</label>
            <select
              value={status || "Pending"}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`w-full p-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(status)}`}
            >
              <option value="Pending">🟡 Pending</option>
              <option value="Approved">🟢 Approved</option>
              <option value="Rejected">🔴 Rejected</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default SubmissionCard

