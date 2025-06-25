"use client"

import React, { useState } from 'react'
import { Mail, Eye, EyeOff } from 'lucide-react'

interface ProtectedEmailProps {
  user: string
  domain: string
  label: string
  className?: string
}

export const ProtectedEmail: React.FC<ProtectedEmailProps> = ({ 
  user, 
  domain, 
  label, 
  className = "" 
}) => {
  const [isRevealed, setIsRevealed] = useState(false)
  
  // Base64 encode the email parts for additional obfuscation
  const encodedUser = btoa(user)
  const encodedDomain = btoa(domain)
  
  const revealEmail = () => {
    setIsRevealed(true)
  }
  
  const getEmail = () => {
    try {
      return `${atob(encodedUser)}@${atob(encodedDomain)}`
    } catch {
      return `${user}@${domain}`
    }
  }
  
  const handleEmailClick = () => {
    if (isRevealed) {
      window.location.href = `mailto:${getEmail()}`
    } else {
      revealEmail()
    }
  }
  
  return (
    <button
      onClick={handleEmailClick}
      className={`text-blue-800 hover:text-blue-600 font-medium transition-colors flex items-center gap-2 ${className}`}
      title={isRevealed ? `Email: ${getEmail()}` : "Click to reveal email"}
    >
      <Mail className="w-4 h-4" />
      {isRevealed ? (
        <span>{getEmail()}</span>
      ) : (
        <span className="flex items-center gap-1">
          <span>Click to show {label}</span>
          <Eye className="w-4 h-4" />
        </span>
      )}
    </button>
  )
}

interface ObfuscatedEmailProps {
  children: string
  className?: string
}

export const ObfuscatedEmail: React.FC<ObfuscatedEmailProps> = ({ 
  children, 
  className = "" 
}) => {
  // Split email into parts and reverse them
  const [localPart, domainPart] = children.split('@')
  const reversedLocal = localPart.split('').reverse().join('')
  const reversedDomain = domainPart.split('').reverse().join('')
  
  return (
    <a
      href={`mailto:${children}`}
      className={`text-blue-800 hover:text-blue-600 font-medium transition-colors ${className}`}
      style={{ 
        unicodeBidi: 'bidi-override',
        direction: 'rtl'
      }}
    >
      <span style={{ direction: 'ltr', unicodeBidi: 'bidi-override' }}>
        {reversedDomain}@{reversedLocal}
      </span>
    </a>
  )
}

interface ClickToRevealEmailProps {
  email: string
  label: string
  className?: string
}

export const ClickToRevealEmail: React.FC<ClickToRevealEmailProps> = ({
  email,
  label,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }
  
  const handleEmailClick = (e: React.MouseEvent) => {
    if (isVisible) {
      window.location.href = `mailto:${email}`
    } else {
      e.preventDefault()
      toggleVisibility()
    }
  }
  
  return (
    <div className={className}>
      <button
        onClick={handleEmailClick}
        className={`font-medium transition-all duration-300 flex items-center gap-2 ${
          className?.includes('inline-flex') 
            ? 'text-white hover:text-cyan-300 hover:scale-105' 
            : 'text-blue-800 hover:text-blue-600'
        }`}
        title={isVisible ? `Email: ${email}` : "Click to reveal email address"}
      >
        {isVisible ? (
          <>
            <Mail className="w-4 h-4" />
            <span>{email}</span>
            <EyeOff className="w-4 h-4 ml-1" />
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            <span>{label}</span>
            <Eye className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </div>
  )
} 