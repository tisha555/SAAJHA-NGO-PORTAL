import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Droplets, MapPin, Calendar, ArrowLeft, Plus, Award } from "lucide-react";
import { API, AuthContext } from "@/App";
import { toast } from "sonner";

const DonationHistory = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDonation, setNewDonation] = useState({
    blood_type: user?.blood_type || "",
    units_donated: 1,
    hospital_name: "",
    city: ""
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    if (user?.role === "donor") {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/donation-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch donation history:", error);
      toast.error("Failed to load donation history");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDonation = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/donation-history`, newDonation, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Donation recorded successfully!");
      setShowAddDialog(false);
      setNewDonation({
        blood_type: user?.blood_type || "",
        units_donated: 1,
        hospital_name: "",
        city: ""
      });
      fetchHistory();
    } catch (error) {
      console.error("Failed to record donation:", error);
      toast.error("Failed to record donation");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTotalUnits = () => {
    return history.reduce((total, donation) => total + donation.units_donated, 0);
  };

  if (user?.role !== "donor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50">
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Donor Only Feature</h3>
              <p className="text-gray-600">This feature is only available for registered blood donors.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
                <p className="text-gray-600">Track your life-saving contributions</p>
              </div>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button
                  data-testid="add-donation-btn"
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Record Donation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Blood Donation</DialogTitle>
                  <DialogDescription>Add a new blood donation to your history</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDonation} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blood_type">Blood Type</Label>
                      <Select
                        value={newDonation.blood_type}
                        onValueChange={(value) => setNewDonation({ ...newDonation, blood_type: value })}
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
                    <div className="space-y-2">
                      <Label htmlFor="units_donated">Units Donated</Label>
                      <Input
                        id="units_donated"
                        data-testid="units-input"
                        type="number"
                        min="1"
                        max="5"
                        value={newDonation.units_donated}
                        onChange={(e) => setNewDonation({ ...newDonation, units_donated: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital_name">Hospital Name</Label>
                    <Input
                      id="hospital_name"
                      data-testid="hospital-input"
                      value={newDonation.hospital_name}
                      onChange={(e) => setNewDonation({ ...newDonation, hospital_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      data-testid="city-input"
                      value={newDonation.city}
                      onChange={(e) => setNewDonation({ ...newDonation, city: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    data-testid="submit-donation-btn"
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                  >
                    Record Donation
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="stat-donations" className="card-hover bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Donations</CardTitle>
              <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-rose-600">{history.length}</div>
              <p className="text-xs text-gray-600 mt-1">Times you donated</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-units" className="card-hover bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Units</CardTitle>
              <Droplets className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{getTotalUnits()}</div>
              <p className="text-xs text-gray-600 mt-1">Units of blood donated</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-impact" className="card-hover bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Lives Saved</CardTitle>
              <Award className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{getTotalUnits() * 3}</div>
              <p className="text-xs text-gray-600 mt-1">Approximate lives impacted</p>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rose-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Droplets className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Donations Yet</h3>
              <p className="text-gray-600 mb-6">Start recording your donations to track your impact</p>
              <Button
                data-testid="record-first-donation-btn"
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Record Your First Donation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Donation Timeline</h2>
            {history.map((donation, index) => (
              <Card
                key={donation.id}
                data-testid={`donation-${index}`}
                className="card-hover border-l-4 border-l-rose-500"
              >
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl w-16 h-16 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">{donation.blood_type}</div>
                          <div className="text-xs">Blood</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Donated {donation.units_donated} {donation.units_donated === 1 ? 'unit' : 'units'}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{donation.hospital_name}, {donation.city}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(donation.donation_date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Completed
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Thank You Message */}
        {history.length > 0 && (
          <Card className="mt-8 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500 text-white border-0">
            <CardContent className="text-center py-8">
              <Heart className="w-12 h-12 mx-auto mb-4" fill="white" />
              <h3 className="text-2xl font-bold mb-2">Thank You for Being a Hero!</h3>
              <p className="text-rose-100">
                Your {history.length} donation{history.length !== 1 ? 's' : ''} have made a real difference in saving lives.
                Keep up the amazing work!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
