import React, { useEffect, useState } from "react";
import { getAllCve, getAllCveLimit } from "../apis/cveApi";
import CardCve from "../components/card/CardCve";
import Pagination from "../components/navigation/Pagination";
import { useParams, useSearchParams } from "react-router-dom";

const CveList = () => {
  const [params] = useSearchParams();
  const [listCve, setListCve] = useState([]);
  const [count, setCount] = useState(0);
  const fetchCve = async () => {
    const response = await getAllCveLimit(params.get("page"));
    console.log(response);
    setCount(response.cves.count);
    setListCve(response.cves.rows);
  };
  useEffect(() => {
    fetchCve();
  }, [params]);
  return (
    <div>
      {listCve.map((item, index) => {
        return (
          <div
            key={index}
            className="flex items-center justify-center"
            style={{ zIndex: 20 }}
          >
            <CardCve cve={item} />
          </div>
        );
      })}
      <Pagination count={count} number={params.get("page")} />
    </div>
  );
};

export default CveList;
