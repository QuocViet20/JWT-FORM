import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../../Redux/apiRequest";
import { logoutSuccess } from "../../Redux/authSlice";
import { createAxios } from "../../createInstance";

const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser)
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const axiosJWT = createAxios(user, dispatch, logoutSuccess)

  const handleLogout = () => {
    logoutUser(dispatch, id, navigate, accessToken, axiosJWT)
  }
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home"> Home </Link>
      {user ? (
        <>
          <p className="navbar-user">Hi, <span> {user.username}  </span> </p>
          <Link to="/logout" className="navbar-logout" onClick={handleLogout}> Log out</Link>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-login"> Login </Link>
          <Link to="/register" className="navbar-register"> Register</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
