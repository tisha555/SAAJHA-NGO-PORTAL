import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Droplets, Users, Building2, AlertCircle, LogOut, Menu, X } from "lucide-react";
import { API, AuthContext } from "@/App";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchRecentRequests();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchRecentRequests = async () => {
    try {
      const response = await axios.get(`${API}/blood-requests?status=active`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentRequests(response.data.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <Heart className="w-5 h-5" /> },
    { label: "Blood Requests", path: "/blood-requests", icon: <Droplets className="w-5 h-5" /> },
    { label: "Create Request", path: "/create-request", icon: <AlertCircle className="w-5 h-5" /> },
    { label: "Medical Facilities", path: "/medical-facilities", icon: <Building2 className="w-5 h-5" /> },
    { label: "Donation History", path: "/donation-history", icon: <Users className="w-5 h-5" /> },
  ];

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-orange-100 text-orange-700",
      critical: "bg-red-100 text-red-700"
    };
    return colors[urgency] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">NGO SAAJHA</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.full_name}</span>
              <Button
                data-testid="logout-btn"
                onClick={logout}
                variant="outline"
                className="border-rose-500 text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 mb-2">Welcome, {user?.full_name}</p>
              <Button
                onClick={logout}
                variant="outline"
                className="w-full border-rose-500 text-rose-600"
                data-testid="mobile-logout-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                data-testid={`menu-${item.path}`}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  window.location.pathname === item.path
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                    : "text-gray-700 hover:bg-rose-50"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 data-testid="dashboard-title" className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.full_name}!
              </h1>
              <p className="text-gray-600">Here's what's happening in your community</p>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card data-testid="stat-donors" className="card-hover border-l-4 border-l-rose-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Donors</CardTitle>
                    <Users className="h-5 w-5 text-rose-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stats.total_donors}</div>
                  </CardContent>
                </Card>

                <Card data-testid="stat-requests" className="card-hover border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Active Requests</CardTitle>
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stats.active_requests}</div>
                  </CardContent>
                </Card>

                <Card data-testid="stat-fulfilled" className="card-hover border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Fulfilled Requests</CardTitle>
                    <Droplets className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stats.fulfilled_requests}</div>
                  </CardContent>
                </Card>

                <Card data-testid="stat-facilities" className="card-hover border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Medical Facilities</CardTitle>
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{stats.total_facilities}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card data-testid="quick-action-create" className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <AlertCircle className="w-6 h-6 text-rose-600" />
                    <span>Need Blood Urgently?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Create a blood request and connect with donors instantly</p>
                  <Button
                    data-testid="create-request-btn"
                    onClick={() => navigate("/create-request")}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700"
                  >
                    Create Request
                  </Button>
                </CardContent>
              </Card>

              <Card data-testid="quick-action-browse" className="card-hover bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <Droplets className="w-6 h-6 text-sky-600" />
                    <span>Donate Blood</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Browse active blood requests and save lives today</p>
                  <Button
                    data-testid="browse-requests-btn"
                    onClick={() => navigate("/blood-requests")}
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700"
                  >
                    Browse Requests
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Requests */}
            <Card data-testid="recent-requests-card">
              <CardHeader>
                <CardTitle className="text-2xl">Recent Blood Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {recentRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No active blood requests at the moment</p>
                ) : (
                  <div className="space-y-4">
                    {recentRequests.map((request, index) => (
                      <div
                        key={request.id}
                        data-testid={`recent-request-${index}`}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="bg-rose-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                              {request.blood_type}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{request.patient_name}</h3>
                              <p className="text-sm text-gray-600">{request.hospital_name}, {request.city}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency.toUpperCase()}
                          </span>
                          <Button
                            data-testid={`view-request-${index}`}
                            onClick={() => navigate("/blood-requests")}
                            size="sm"
                            variant="outline"
                            className="border-rose-500 text-rose-600 hover:bg-rose-50"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="grid grid-cols-4 gap-1 p-2">
                {menuItems.slice(0, 4).map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center py-2 px-1 rounded-lg ${
                      window.location.pathname === item.path
                        ? "text-rose-600 bg-rose-50"
                        : "text-gray-600"
                    }`}
                    data-testid={`mobile-nav-${item.path}`}
                  >
                    {item.icon}
                    <span className="text-xs mt-1">{item.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
