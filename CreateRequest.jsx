import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { API, AuthContext } from "@/App";
import { toast } from "sonner";

const CreateRequest = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: "",
    blood_type: "",
    units_needed: 1,
    urgency: "medium",
    hospital_name: "",
    city: "",
    state: "",
    contact_phone: "",
    contact_email: "",
    reason: ""
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const urgencyLevels = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "high", label: "High", color: "text-orange-600" },
    { value: "critical", label: "Critical", color: "text-red-600" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/blood-requests`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Blood request created successfully!");
      navigate("/blood-requests");
    } catch (error) {
      console.error("Failed to create request:", error);
      toast.error(error.response?.data?.detail || "Failed to create blood request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button
              data-testid="back-to-dashboard-btn"
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Blood Request</h1>
              <p className="text-gray-600">Submit a blood donation request for urgent needs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert */}
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mb-8 rounded-r-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-rose-900">Important Information</h3>
              <p className="text-sm text-rose-700 mt-1">
                Please ensure all information is accurate. Your request will be visible to registered donors in your area.
              </p>
            </div>
          </div>
        </div>

        <Card data-testid="create-request-card" className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Blood Request Details</CardTitle>
            <CardDescription>Fill in the information about the blood requirement</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Patient Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient_name">Patient Name *</Label>
                    <Input
                      id="patient_name"
                      data-testid="patient-name-input"
                      placeholder="John Doe"
                      value={formData.patient_name}
                      onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blood_type">Blood Type Required *</Label>
                    <Select
                      value={formData.blood_type}
                      onValueChange={(value) => setFormData({ ...formData, blood_type: value })}
                      required
                    >
                      <SelectTrigger data-testid="blood-type-select">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="units_needed">Units Needed *</Label>
                    <Input
                      id="units_needed"
                      data-testid="units-input"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.units_needed}
                      onChange={(e) => setFormData({ ...formData, units_needed: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                      required
                    >
                      <SelectTrigger data-testid="urgency-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            <span className={level.color}>{level.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="hospital_name">Hospital Name *</Label>
                  <Input
                    id="hospital_name"
                    data-testid="hospital-input"
                    placeholder="City Hospital"
                    value={formData.hospital_name}
                    onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      data-testid="city-input"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      data-testid="state-input"
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone *</Label>
                    <Input
                      id="contact_phone"
                      data-testid="phone-input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email (Optional)</Label>
                    <Input
                      id="contact_email"
                      data-testid="email-input"
                      type="email"
                      placeholder="contact@email.com"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  data-testid="reason-textarea"
                  placeholder="Provide additional details about the requirement..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <Button
                  data-testid="submit-request-btn"
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 py-6"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Request...
                    </>
                  ) : (
                    "Submit Blood Request"
                  )}
                </Button>

                <Button
                  data-testid="cancel-btn"
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="px-8"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRequest;
