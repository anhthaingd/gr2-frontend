import React from "react";
import { createSearchParams, useNavigate } from "react-router-dom";

const notActive =
  "px-5 py-3 bg-white hover:bg-gray-300 rounded-md cursor-pointer";
const active =
  "px-5 py-3 bg-red-400 text-white hover:bg-gray-300  rounded-md cursor-pointer";
const PageNumber = ({ text, currentPage, setCurrentPage, icon, type }) => {
  const navigate = useNavigate();
  const handleChange = () => {
    if (!(text === "...")) {
      setCurrentPage(+text);
      navigate({
        pathname: "/cves/",
        search: createSearchParams({
          page: text,
        }).toString(),
      });
    }
  };
  return (
    <div
      className={+text === +currentPage ? active : notActive}
      onClick={handleChange}
    >
      {icon || text}
    </div>
  );
};

export default PageNumber;
