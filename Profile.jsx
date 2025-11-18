import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Droplets, Heart, ArrowLeft, Shield } from "lucide-react";
import { AuthContext } from "@/App";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [availableToDonate, setAvailableToDonate] = useState(user?.available_to_donate ?? true);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role) => {
    const badges = {
      donor: { label: "Blood Donor", color: "bg-rose-100 text-rose-700" },
      beneficiary: { label: "Beneficiary", color: "bg-blue-100 text-blue-700" },
      medical_facility: { label: "Medical Facility", color: "bg-green-100 text-green-700" },
      admin: { label: "Administrator", color: "bg-purple-100 text-purple-700" }
    };
    return badges[role] || badges.beneficiary;
  };

  const handleAvailabilityToggle = async () => {
    // In a real app, this would update the backend
    setAvailableToDonate(!availableToDonate);
    toast.success(
      availableToDonate
        ? "You're now marked as unavailable for donation"
        : "You're now available for donation requests!"
    );
  };

  const badge = getRoleBadge(user?.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50">
      {/* Header */}
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
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <Card data-testid="profile-card" className="mb-8 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-600">
                <AvatarFallback className="text-2xl font-bold text-white">
                  {getInitials(user?.full_name || "User")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.full_name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <Badge className={`${badge.color} border-0`}>{badge.label}</Badge>
                  {user?.blood_type && (
                    <Badge className="bg-rose-500 text-white border-0">
                      Blood Type: {user.blood_type}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">Member since {new Date(user?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card data-testid="contact-info-card" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>

            {user?.phone && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

            {(user?.city || user?.state) && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">
                    {[user?.city, user?.state].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
            )}

            {user?.location && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900">{user.location}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Donor Settings */}
        {user?.role === "donor" && (
          <Card data-testid="donor-settings-card" className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Droplets className="w-5 h-5" />
                <span>Donor Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-rose-500" />
                  <div>
                    <Label htmlFor="availability" className="text-base font-semibold text-gray-900">
                      Available for Donation
                    </Label>
                    <p className="text-sm text-gray-600">
                      {availableToDonate
                        ? "You will appear in donor searches"
                        : "You won't appear in donor searches"}
                    </p>
                  </div>
                </div>
                <Switch
                  id="availability"
                  data-testid="availability-toggle"
                  checked={availableToDonate}
                  onCheckedChange={handleAvailabilityToggle}
                  className="data-[state=checked]:bg-rose-500"
                />
              </div>

              {user?.blood_type && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Droplets className="w-5 h-5 text-rose-500" />
                    <h3 className="font-semibold text-gray-900">Your Blood Type</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-lg px-4 py-2 text-xl font-bold">
                      {user.blood_type}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Compatible with recipients needing {user.blood_type}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card data-testid="account-actions-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Account Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              data-testid="view-donations-btn"
              onClick={() => navigate("/donation-history")}
              variant="outline"
              className="w-full justify-start"
            >
              <Heart className="w-4 h-4 mr-2" />
              View Donation History
            </Button>

            <Button
              data-testid="browse-requests-btn"
              onClick={() => navigate("/blood-requests")}
              variant="outline"
              className="w-full justify-start"
            >
              <Droplets className="w-4 h-4 mr-2" />
              Browse Blood Requests
            </Button>

            <Button
              data-testid="logout-btn"
              onClick={logout}
              variant="destructive"
              className="w-full justify-start bg-rose-500 hover:bg-rose-600"
            >
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Impact Message */}
        {user?.role === "donor" && (
          <Card className="mt-8 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500 text-white border-0">
            <CardContent className="text-center py-8">
              <Heart className="w-12 h-12 mx-auto mb-4 blood-drop" fill="white" />
              <h3 className="text-2xl font-bold mb-2">Thank You for Being a Lifesaver!</h3>
              <p className="text-rose-100 max-w-2xl mx-auto">
                Your willingness to donate blood makes you a hero in someone's life. Every donation can save up to 3 lives.
                Together, we're making healthcare accessible to everyone.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
