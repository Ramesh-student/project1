"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Zap,
  Wrench,
  Star,
  ArrowRight,
  Search,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Phone,
  Mail,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const services = [
    {
      icon: Zap,
      title: "Electrical Services",
      description: "Professional electricians for all your electrical needs",
      features: ["Wiring & Rewiring", "Panel Upgrades", "Emergency Repairs", "Smart Home Setup"],
      rating: 4.9,
      jobs: "2,500+ completed",
      price: "Starting ₹299",
    },
    {
      icon: Wrench,
      title: "Plumbing Services",
      description: "Expert plumbers for repairs and installations",
      features: ["Pipe Repairs", "Fixture Installation", "Drain Cleaning", "Water Heater Service"],
      rating: 4.8,
      jobs: "1,800+ completed",
      price: "Starting ₹199",
    },
  ]

  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: CheckCircle, value: "25,000+", label: "Jobs Completed" },
    { icon: Star, value: "4.9/5", label: "Average Rating" },
    { icon: Clock, value: "24/7", label: "Support Available" },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Excellent service! The electrician arrived on time and fixed my wiring issues professionally.",
      service: "Electrical",
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      text: "Quick response for my plumbing emergency. Very satisfied with the quality of work.",
      service: "Plumbing",
    },
    {
      name: "Anita Patel",
      location: "Bangalore",
      rating: 5,
      text: "Professional team, fair pricing, and excellent customer service. Highly recommended!",
      service: "Electrical",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ServiceHub
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">
                Services
              </Link>
              <Link href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">
                Contact
              </Link>
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col space-y-4">
                <Link href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Services
                </Link>
                <Link href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
                <Link href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
              🎉 Now serving 50+ cities across India
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">
              Your Trusted
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Home Service
              </span>
              Partner
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with verified electricians and plumbers for quality home services. Professional, reliable, and
              available 24/7 for all your home maintenance needs.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search for services in your area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-2xl shadow-lg"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl">
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-2xl shadow-xl"
                >
                  Book a Service
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/signup?type=provider">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 hover:border-blue-500 px-8 py-4 text-lg rounded-2xl"
                >
                  Join as Provider
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to ServiceHub v13</h1>
            <p className="text-xl mb-8">Your one-stop platform for home services</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="card">
                <h2 className="text-2xl font-semibold mb-4">For Customers</h2>
                <p className="mb-6">Book services, track requests, and manage payments</p>
                <Link href="/login?type=customer" className="btn btn-primary inline-block">
                  Customer Login
                </Link>
              </div>

              <div className="card">
                <h2 className="text-2xl font-semibold mb-4">For Service Providers</h2>
                <p className="mb-6">Manage service requests and customer interactions</p>
                <Link href="/login?type=provider" className="btn btn-primary inline-block">
                  Provider Login
                </Link>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Admin Access</h2>
              <p className="mb-6">Manage the platform, users, and services</p>
              <Link href="/login?type=admin" className="btn btn-secondary inline-block">
                Admin Login
              </Link>
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Demo Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-gray-100 rounded-md">
                  <p>
                    <strong>Customer:</strong>
                  </p>
                  <p>Email: customer@demo.com</p>
                  <p>Password: password123</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-md">
                  <p>
                    <strong>Provider:</strong>
                  </p>
                  <p>Email: electrician@demo.com</p>
                  <p>Password: password123</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-md">
                  <p>
                    <strong>Admin:</strong>
                  </p>
                  <p>Email: admin@demo.com</p>
                  <p>Password: password123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700">Our Services</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Professional Home Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Expert technicians ready to solve your home maintenance challenges with quality service and fair pricing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <service.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-slate-900">{service.title}</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{service.rating}</span>
                          </div>
                          <span className="text-sm text-slate-500">{service.jobs}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">{service.price}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 mb-6 text-lg">{service.description}</CardDescription>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3">
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">What Our Customers Say</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real feedback from thousands of satisfied customers across India.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-slate-50"
              >
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {testimonial.location}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {testimonial.service}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust ServiceHub for their home service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 text-lg rounded-2xl shadow-xl"
              >
                Book Your Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signup?type=provider">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-2xl"
              >
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ServiceHub</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Your trusted partner for professional home services. Quality work, fair prices, and reliable service
                guaranteed.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-300">1800-123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-300">support@servicehub.com</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Electrical Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Plumbing Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Emergency Repairs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Maintenance Plans
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ServiceHub. All rights reserved. Built with ❤️ in India.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
