import React, { useState, useEffect, useContext } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import SearchForm from "./SearchForm";
import "../../Css/Header.css";
import { RiPencilFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { BsBookmarks } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
// import SkeletonElement from '../Skeletons/SkeletonElement';
// import { AuthContext } from '../../Context/AuthContext';
import * as actions from "../../store/actions";
const Header = () => {
  const dispatch = useDispatch();
  const bool = localStorage.getItem("authToken") ? true : false;
  const [auth, setAuth] = useState(bool);
  const { isLoggedIn } = useSelector((state) => state.auth);
  // const { activeUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setAuth(bool);
    setTimeout(() => {
      setLoading(false);
    }, 1600);
  }, [bool]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    dispatch(actions.logout());
  };
  const handleChange = () => {
    navigate({
      pathname: "/cves/",
      search: createSearchParams({
        page: 1,
      }).toString(),
    });
  };
  return (
    <header>
      <div className="averager">
        <Link to="/" className="logo">
          <h5>THREAT BLOG</h5>
        </Link>
        <SearchForm />
        <div className="auth_options">
          <button
            className="addStory-link cursor-pointer"
            onClick={handleChange}
          >
            CVE DOCS
          </button>
        </div>
        <div className="header_options">
          {isLoggedIn ? (
            <div className="auth_options">
              <Link className="addStory-link" to="/addstory">
                <RiPencilFill /> Add Story
              </Link>

              <Link to="/readList" className="readList-link">
                <BsBookmarks />
                {/* <span id="readListLength">
                                    {activeUser.readListLength}
                                </span> */}
              </Link>
              <div className="header-profile-wrapper ">
                {/* {loading ? <SkeletonElement type="minsize-avatar" />

                                    :

                                    <img src={`/userPhotos/${activeUser.photo}`} alt={activeUser.username} />

                                } */}
                <img src="login.png" alt="thai" />
                <div className="sub-profile-wrap  ">
                  <Link className="profile-link" to="/profile">
                    {" "}
                    <FaUserEdit /> Profile{" "}
                  </Link>

                  <button className="logout-btn" onClick={handleLogout}>
                    {" "}
                    <BiLogOut /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="noAuth_options">
              <Link className="login-link" to="/login">
                {" "}
                Login{" "}
              </Link>

              <Link className="register-link" to="/register">
                {" "}
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
