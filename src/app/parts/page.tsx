"use client"

import { useState } from "react"
import { parts } from "../data/initialData"

export default function PartsPage() {
  const [search, setSearch] = useState("")
  const filteredParts = parts.filter((part: string) =>
    part.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4 sm:px-8">
      <div className="max-w-full mx-auto px-48">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center drop-shadow-sm">Available Auto Parts</h1>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search parts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg shadow-sm bg-white"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredParts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg">No parts found.</div>
          ) : (
            filteredParts.map((part: string, idx: number) => (
              <div
                key={part + idx}
                className="bg-white rounded-xl shadow-md p-5 flex items-center gap-3 border border-blue-100 hover:shadow-lg transition-shadow duration-200"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                <span className="text-blue-900 font-medium text-base">{part}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

