import {
    Mail,
    Phone,
    Zap,
    Shield,
    Users,
  } from "lucide-react"

export const contactMethods = [
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

  export const locations = [
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

  export const features = [
    {
      icon: Zap,
      title: "Fast Response",
      description: "Get replies within few hours during business hours",
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

