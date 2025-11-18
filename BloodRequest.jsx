import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Droplets, MapPin, Phone, Mail, Clock, ArrowLeft, Search } from "lucide-react";
import { API, AuthContext } from "@/App";
import { toast } from "sonner";

const BloodRequests = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    blood_type: "",
    city: "",
    urgency: ""
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const urgencyLevels = ["low", "medium", "high", "critical"];

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("status", "active");
      if (filters.blood_type) params.append("blood_type", filters.blood_type);
      if (filters.city) params.append("city", filters.city);
      if (filters.urgency) params.append("urgency", filters.urgency);

      const response = await axios.get(`${API}/blood-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load blood requests");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: "bg-green-100 text-green-700 border-green-300",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
      high: "bg-orange-100 text-orange-700 border-orange-300",
      critical: "bg-red-100 text-red-700 border-red-300"
    };
    return colors[urgency] || colors.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                data-testid="back-btn"
                onClick={() => navigate("/dashboard")}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blood Requests</h1>
                <p className="text-gray-600">Find and respond to blood donation requests</p>
              </div>
            </div>
            <Button
              data-testid="create-request-nav-btn"
              onClick={() => navigate("/create-request")}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700"
            >
              Create Request
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card data-testid="filters-card" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Filter Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Blood Type</label>
                <Select
                  value={filters.blood_type}
                  onValueChange={(value) => setFilters({ ...filters, blood_type: value })}
                >
                  <SelectTrigger data-testid="filter-blood-type">
                    <SelectValue placeholder="All Blood Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Blood Types</SelectItem>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                <Input
                  data-testid="filter-city"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Urgency</label>
                <Select
                  value={filters.urgency}
                  onValueChange={(value) => setFilters({ ...filters, urgency: value })}
                >
                  <SelectTrigger data-testid="filter-urgency">
                    <SelectValue placeholder="All Urgency Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Urgency Levels</SelectItem>
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              data-testid="clear-filters-btn"
              onClick={() => setFilters({ blood_type: "", city: "", urgency: "" })}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Requests List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rose-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Droplets className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blood Requests Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or check back later</p>
              <Button
                data-testid="create-new-request-btn"
                onClick={() => navigate("/create-request")}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white"
              >
                Create New Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {requests.map((request, index) => (
              <Card
                key={request.id}
                data-testid={`blood-request-${index}`}
                className="card-hover border-l-4 border-l-rose-500"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl w-16 h-16 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xl font-bold">{request.blood_type}</div>
                          <div className="text-xs">Blood</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{request.patient_name}</h3>
                        <p className="text-sm text-gray-600">{request.units_needed} units needed</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency.toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-rose-500 mt-0.5" />
                      <div>
                        <p className="font-medium">{request.hospital_name}</p>
                        <p className="text-sm text-gray-600">{request.city}, {request.state}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-700">
                      <Phone className="w-5 h-5 text-rose-500" />
                      <span>{request.contact_phone}</span>
                    </div>

                    {request.contact_email && (
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Mail className="w-5 h-5 text-rose-500" />
                        <span className="text-sm">{request.contact_email}</span>
                      </div>
                    )}

                    {request.reason && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Reason: </span>
                          {request.reason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm text-gray-500 pt-2 border-t">
                      <Clock className="w-4 h-4" />
                      <span>Posted {formatDate(request.created_at)}</span>
                    </div>

                    <div className="pt-2">
                      <Button
                        data-testid={`contact-btn-${index}`}
                        onClick={() => {
                          window.location.href = `tel:${request.contact_phone}`;
                        }}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700"
                      >
                        Contact Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodRequests;
