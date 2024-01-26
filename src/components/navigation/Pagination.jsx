import React, { useEffect, useState } from "react";
import PageNumber from "./PageNumber";
import { FaGripLines } from "react-icons/fa";
import { SlControlForward, SlControlRewind } from "react-icons/sl";
import { type } from "@testing-library/user-event/dist/type";
const Pagination = ({ number, count }) => {
  const [currentPage, setCurrentPage] = useState(+number);
  const [arrPage, setArrPage] = useState([]);
  const [isHideEnd, setIsHideEnd] = useState(false);
  const [isHideStart, setIsHideStart] = useState(false);
  const handlePageNumber = () => {
    let max = Math.floor(count / 8);
    let arrNumber = [];
    for (let i = 1; i <= max; i++) {
      arrNumber.push(i);
    }
    return arrNumber.length > 3 ? arrNumber.filter((i) => i < 4) : arrNumber;
  };
  useEffect(() => {
    let max = Math.floor(count / 8);
    let end = currentPage + 1 > max ? max : currentPage + 1;
    let start = currentPage - 1 <= 0 ? 1 : currentPage - 1;
    let temp = [];
    for (let i = start; i <= end; i++) {
      temp.push(i);
    }
    setArrPage(temp);
    currentPage >= max - 1 ? setIsHideEnd(true) : setIsHideEnd(false);
    currentPage <= 2 ? setIsHideStart(true) : setIsHideStart(false);
  }, [count, currentPage]);
  return (
    <div className="flex items-center justify-center gap-2 mt-2 mb-2">
      {!isHideStart && (
        <PageNumber
          icon={<SlControlRewind />}
          text={1}
          setCurrentPage={setCurrentPage}
        />
      )}
      {!isHideStart && <PageNumber text={"..."} />}
      {arrPage.length > 0 &&
        arrPage.map((item) => {
          return (
            <PageNumber
              key={item}
              text={item}
              currentPage={number || 1}
              setCurrentPage={setCurrentPage}
            />
          );
        })}
      {!isHideEnd && (
        <PageNumber
          text={"..."}
        />
      )}
      {!isHideEnd && (
        <PageNumber
          icon={<SlControlForward />}
          text={Math.floor(count / 8)}
          type="end"
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Pagination;
