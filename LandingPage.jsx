import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Droplets, Building2, Users, ArrowRight, Shield, Clock, MapPin } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Blood Donation",
      description: "Connect donors with those in urgent need of blood"
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Medical Facilities",
      description: "Access comprehensive directory of healthcare centers"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Join a network of compassionate individuals helping others"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Your data is protected with advanced security measures"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Registered Donors" },
    { value: "5,000+", label: "Lives Saved" },
    { value: "500+", label: "Medical Facilities" },
    { value: "24/7", label: "Emergency Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2.5 rounded-xl">
                <Heart className="w-7 h-7 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NGO SAAJHA</h1>
                <p className="text-xs text-gray-600">Together We Care</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                data-testid="nav-login-btn"
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-rose-600 hover:bg-rose-50"
              >
                Login
              </Button>
              <Button
                data-testid="nav-register-btn"
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in">
            <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4" fill="currentColor" />
              <span className="text-sm font-medium">Saving Lives Together</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Every Drop of Blood
              <br />
              <span className="gradient-text">Saves a Life</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Join NGO SAAJHA Portal - A compassionate platform connecting donors with those in need.
              Together, we can make healthcare accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                data-testid="hero-register-btn"
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 px-8 py-6 text-lg shadow-xl shadow-rose-200"
              >
                Register as Donor
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                data-testid="hero-find-blood-btn"
                onClick={() => navigate("/register")}
                variant="outline"
                className="border-2 border-rose-500 text-rose-600 hover:bg-rose-50 px-8 py-6 text-lg"
              >
                Find Blood Donors
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                data-testid={`stat-${index}`}
                className="bg-white rounded-2xl p-6 text-center shadow-lg card-hover border border-gray-100"
              >
                <h3 className="text-3xl font-bold text-rose-600 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How We Help
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive tools to facilitate blood donation and healthcare access
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                data-testid={`feature-${index}`}
                className="bg-gradient-to-br from-white to-rose-50 p-8 rounded-2xl shadow-lg card-hover border border-rose-100"
              >
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Simple Steps to Save Lives
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to make a difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div data-testid="step-1" className="text-center">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Register</h3>
              <p className="text-gray-600">Create your account and complete your profile with blood type and location</p>
            </div>

            <div data-testid="step-2" className="text-center">
              <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-600">Find blood donation requests or post your own urgent requirements</p>
            </div>

            <div data-testid="step-3" className="text-center">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Save Lives</h3>
              <p className="text-gray-600">Donate blood and help someone in need while tracking your impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-16 h-16 text-white mx-auto mb-6 blood-drop" fill="white" />
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-rose-100 mb-10">
            Join thousands of donors and beneficiaries on our platform today
          </p>
          <Button
            data-testid="cta-join-btn"
            onClick={() => navigate("/register")}
            className="bg-white text-rose-600 hover:bg-gray-100 px-10 py-6 text-lg font-semibold shadow-xl"
          >
            Join NGO SAAJHA Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-rose-500" fill="currentColor" />
                <h3 className="text-xl font-bold">NGO SAAJHA</h3>
              </div>
              <p className="text-gray-400">Together we care, together we save lives</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-rose-500">About Us</a></li>
                <li><a href="#" className="hover:text-rose-500">Contact</a></li>
                <li><a href="#" className="hover:text-rose-500">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-rose-500">Blood Donation</a></li>
                <li><a href="#" className="hover:text-rose-500">Medical Facilities</a></li>
                <li><a href="#" className="hover:text-rose-500">Emergency Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>India</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>24/7 Support</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NGO SAAJHA Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
