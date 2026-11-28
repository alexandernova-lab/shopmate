import React from "react";
import Button from "@mui/material/Button";
import { logoutUser } from "../api/authApi.js";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser();

    navigate("/login");
  };
  return (
    <div>
      <h1>Home Page</h1>
      <Button onClick={handleLogout} variant="contained">
        Logout
      </Button>
    </div>
  );
};

export default HomePage;
