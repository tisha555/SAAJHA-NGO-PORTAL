// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'
// import Home from './pages/Home';
// import CardItemLogin from './components/CardItemLogin';
// import NGOs from './pages/NGOs';
// import Landing from './pages/Volunteer/Landing';
// import ViewRequirement from './pages/Volunteer/ViewRequirement'
// import VolunteerRegister from './pages/Volunteer/VolunteerRegister';
// import VolunteerLogin from './pages/Volunteer/VolunteerLogin';
// import { VolunteerRoute } from './components/PrivateRoute';
// import AdminLogin from './pages/Admin/AdminLogin';
// import AdminRegister from './pages/Admin/AdminRegister';
// import ViewStatus from './pages/Volunteer/ViewStatus';
// import FAQs from './pages/FAQs';
// import AdminLanding from './pages/Admin/AdminLanding';
// import { AdminRoute } from './components/PrivateRoute';
// import ViewNGO from './pages/NGO/ViewNGO';
// import ViewRequests from './pages/Admin/ViewRequests';
// import UpdateStatus from './pages/Admin/UpdateStatus';
// import ViewVolunteers from './pages/Admin/ViewVolunteers';
// import AddRequirements from './pages/Admin/AddRequirements';

// function App() {
//   return (
//     <>
//     <Router>
//       <div className='App'>
//           <Routes>
            
//           {/* Regular User Routes */}
//             <Route path='/' element={<Home />} />
//             <Route path='/About' element={<Home />} />
//             <Route path='/NGOs' element={<NGOs/>} />
//             <Route path='/LoginSignup' element={<CardItemLogin/>} />
//             <Route path='/FAQs' element={<FAQs/>} />
//             <Route path='/ContactUs' element={<Home />} />
          
          
//           {/* Volunteer Routes */}
//            <Route path='/VolunteerRegister' element={<VolunteerRegister/>} />
//            <Route path='/VolunteerLogin' element={<VolunteerLogin/>} />
           
//            <Route path='/VolunteerLanding' element={<VolunteerRoute />}>
//               <Route path='/VolunteerLanding' element={<Landing/>} /> 
//             </Route>
//             <Route path='/application/:ngoId' element={<VolunteerRoute />}>
//                <Route path='/application/:ngoId' element = {<ViewStatus/>} /> 
//             </Route>
            

//             {/* Admin Routes */}
//             <Route path='/AdminRegister' element={<AdminRegister/>} />
//             <Route path='/AdminLogin' element={<AdminLogin/>} /> 
//             {/* Version 3 */}
            
//             <Route path='/AdminLanding' element={<AdminLanding/>} />
//             {/* NGO Routes */}
//             <Route path='/ViewNGO/:ngoId' element={<AdminRoute />}>
//               <Route path='/ViewNGO/:ngoId' element={<ViewNGO />} /> 
//             </Route>

//             {/* Volunteer Request Routes */}
//             <Route path='/ViewRequests/:ngoId' element={<AdminRoute />}>
//               <Route path='/ViewRequests/:ngoId' element={<ViewRequests />} /> 
//             </Route>
//             <Route path='/:requestId' element={<AdminRoute />}>
//               <Route path='/:requestId' element={<UpdateStatus />} /> 
//             </Route>
//             <Route path='/ViewVolunteers/:ngoId' element={<AdminRoute />}>
//               <Route path='/ViewVolunteers/:ngoId' element={<ViewVolunteers />} /> 
//             </Route>
//             <Route path='/AddRequirements' element={<AdminRoute />}>
//               <Route path='/AddRequirements' element={<AddRequirements />} /> 
//             </Route>
//           <Route path='/requirement/:adminId' element = {<ViewRequirement/>} /> 
         
//           </Routes>
//       </div>
//       </Router>
//       <ToastContainer/>
//     </>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import BloodRequests from "@/pages/BloodRequests";
import CreateRequest from "@/pages/CreateRequest";
import MedicalFacilities from "@/pages/MedicalFacilities";
import DonationHistory from "@/pages/DonationHistory";
import Profile from "@/pages/Profile";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    toast.success("Welcome to NGO SAAJHA Portal!");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-sky-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-rose-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/blood-requests" element={user ? <BloodRequests /> : <Navigate to="/login" />} />
            <Route path="/create-request" element={user ? <CreateRequest /> : <Navigate to="/login" />} />
            <Route path="/medical-facilities" element={user ? <MedicalFacilities /> : <Navigate to="/login" />} />
            <Route path="/donation-history" element={user ? <DonationHistory /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
