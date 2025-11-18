import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API, AuthContext } from "@/App";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      login(response.data.access_token, response.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-sky-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-3 rounded-xl">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">NGO SAAJHA</h1>
          </div>
          <p className="text-gray-600">Welcome back to the community</p>
        </div>

        <Card data-testid="login-card" className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  data-testid="login-email-input"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  data-testid="login-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="border-gray-300"
                />
              </div>

              <Button
                data-testid="login-submit-btn"
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link data-testid="login-register-link" to="/register" className="text-rose-600 hover:text-rose-700 font-semibold">
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            data-testid="back-home-btn"
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
