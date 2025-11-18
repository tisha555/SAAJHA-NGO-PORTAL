import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, MapPin, Phone, Mail, ArrowLeft, Search, Plus, Heart } from "lucide-react";
import { API, AuthContext } from "@/App";
import { toast } from "sonner";

const MedicalFacilities = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    facility_type: ""
  });
  const [newFacility, setNewFacility] = useState({
    name: "",
    facility_type: "hospital",
    address: "",
    city: "",
    state: "",
    phone: "",
    email: "",
    services: [],
    blood_types_available: []
  });

  const facilityTypes = [
    { value: "hospital", label: "Hospital" },
    { value: "clinic", label: "Clinic" },
    { value: "blood_bank", label: "Blood Bank" },
    { value: "diagnostic_center", label: "Diagnostic Center" }
  ];

  const serviceOptions = [
    "Emergency", "Blood Bank", "Surgery", "ICU", "Ambulance", "Laboratory", "Pharmacy"
  ];

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    fetchFacilities();
  }, [filters]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append("city", filters.city);
      if (filters.facility_type) params.append("facility_type", filters.facility_type);

      const response = await axios.get(`${API}/medical-facilities?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFacilities(response.data);
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
      toast.error("Failed to load medical facilities");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/medical-facilities`, newFacility, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Medical facility added successfully!");
      setShowAddDialog(false);
      setNewFacility({
        name: "",
        facility_type: "hospital",
        address: "",
        city: "",
        state: "",
        phone: "",
        email: "",
        services: [],
        blood_types_available: []
      });
      fetchFacilities();
    } catch (error) {
      console.error("Failed to add facility:", error);
      toast.error("Failed to add medical facility");
    }
  };

  const toggleService = (service) => {
    setNewFacility(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const toggleBloodType = (type) => {
    setNewFacility(prev => ({
      ...prev,
      blood_types_available: prev.blood_types_available.includes(type)
        ? prev.blood_types_available.filter(t => t !== type)
        : [...prev.blood_types_available, type]
    }));
  };

  const getFacilityIcon = (type) => {
    return <Building2 className="w-6 h-6" />;
  };

  const getFacilityColor = (type) => {
    const colors = {
      hospital: "from-blue-500 to-blue-600",
      clinic: "from-green-500 to-green-600",
      blood_bank: "from-rose-500 to-pink-600",
      diagnostic_center: "from-purple-500 to-purple-600"
    };
    return colors[type] || colors.hospital;
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
                <h1 className="text-3xl font-bold text-gray-900">Medical Facilities</h1>
                <p className="text-gray-600">Find hospitals, clinics, and blood banks near you</p>
              </div>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button
                  data-testid="add-facility-btn"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Facility
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Medical Facility</DialogTitle>
                  <DialogDescription>Add a new medical facility to the directory</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddFacility} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Facility Name *</Label>
                      <Input
                        id="name"
                        data-testid="facility-name-input"
                        value={newFacility.name}
                        onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facility_type">Type *</Label>
                      <Select
                        value={newFacility.facility_type}
                        onValueChange={(value) => setNewFacility({ ...newFacility, facility_type: value })}
                      >
                        <SelectTrigger data-testid="facility-type-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {facilityTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      data-testid="facility-address-input"
                      value={newFacility.address}
                      onChange={(e) => setNewFacility({ ...newFacility, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        data-testid="facility-city-input"
                        value={newFacility.city}
                        onChange={(e) => setNewFacility({ ...newFacility, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        data-testid="facility-state-input"
                        value={newFacility.state}
                        onChange={(e) => setNewFacility({ ...newFacility, state: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        data-testid="facility-phone-input"
                        value={newFacility.phone}
                        onChange={(e) => setNewFacility({ ...newFacility, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        data-testid="facility-email-input"
                        type="email"
                        value={newFacility.email}
                        onChange={(e) => setNewFacility({ ...newFacility, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Services Offered</Label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((service) => (
                        <button
                          key={service}
                          type="button"
                          data-testid={`service-${service}`}
                          onClick={() => toggleService(service)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            newFacility.services.includes(service)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Blood Types Available</Label>
                    <div className="flex flex-wrap gap-2">
                      {bloodTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          data-testid={`blood-${type}`}
                          onClick={() => toggleBloodType(type)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            newFacility.blood_types_available.includes(type)
                              ? "bg-rose-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    data-testid="submit-facility-btn"
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  >
                    Add Facility
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card data-testid="filters-card" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Filter Facilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">City</Label>
                <Input
                  data-testid="filter-city"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Facility Type</Label>
                <Select
                  value={filters.facility_type}
                  onValueChange={(value) => setFilters({ ...filters, facility_type: value })}
                >
                  <SelectTrigger data-testid="filter-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {facilityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              data-testid="clear-filters-btn"
              onClick={() => setFilters({ city: "", facility_type: "" })}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Facilities List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading facilities...</p>
          </div>
        ) : facilities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Medical Facilities Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or add a new facility</p>
              <Button
                data-testid="add-new-facility-btn"
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Facility
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <Card
                key={facility.id}
                data-testid={`facility-${index}`}
                className="card-hover border-t-4"
                style={{ borderTopColor: getFacilityColor(facility.facility_type).includes('blue') ? '#3b82f6' : getFacilityColor(facility.facility_type).includes('rose') ? '#fb7185' : '#10b981' }}
              >
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className={`bg-gradient-to-br ${getFacilityColor(facility.facility_type)} text-white p-3 rounded-xl`}>
                      {getFacilityIcon(facility.facility_type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{facility.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{facility.facility_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm">{facility.address}</p>
                        <p className="text-sm text-gray-600">{facility.city}, {facility.state}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-700">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">{facility.phone}</span>
                    </div>

                    {facility.email && (
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Mail className="w-5 h-5 text-blue-500" />
                        <span className="text-sm">{facility.email}</span>
                      </div>
                    )}

                    {facility.services.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {facility.services.slice(0, 3).map((service) => (
                            <span
                              key={service}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                          {facility.services.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{facility.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {facility.blood_types_available.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Blood Available:</p>
                        <div className="flex flex-wrap gap-1">
                          {facility.blood_types_available.map((type) => (
                            <span
                              key={type}
                              className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full font-medium"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      data-testid={`call-facility-${index}`}
                      onClick={() => { window.location.href = `tel:${facility.phone}`; }}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                    >
                      Call Now
                    </Button>
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

export default MedicalFacilities;
