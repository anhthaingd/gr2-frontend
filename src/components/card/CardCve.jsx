import React, { useEffect, useState } from "react";
import { getCvssByCveId } from "../../apis/cvssApi";
import { useNavigate } from "react-router-dom";

const CardCve = (item) => {
  const navigate = useNavigate();
  const [cvss, setCvss] = useState();
  const cveId = item.cve.id;
  const fetchCvss = async (cveId) => {
    try {
      const response = await getCvssByCveId(cveId);
      setCvss(response.cvss[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCvss(cveId);
  }, []);
  const cvssBaseScore = cvss?.base_score || 0;

  const getColorByScore = (score) => {
    if (score > 0 && score < 4) {
      return "bg-orange-200 pl-1 pr-1 rounded";
    } else if (score >= 4 && score < 7) {
      return "bg-orange-400 pl-1 pr-1 rounded";
    } else if (score >= 7 && score < 9) {
      return "bg-red-400 pl-1 pr-1 rounded";
    } else if (score >= 9 && score <= 10) {
      return "bg-red-600 pl-1 pr-1 rounded";
    } else {
      return "white";
    }
  };

  const color = getColorByScore(cvssBaseScore);
  return (
    <div className="flex w-3/5 items-center justify-center border-b-2 pl-2 border-cyan-200">
      <div className="sm:w-3/4 p-2">
        <button
          className="mb-2 font-bold text-blue-400 bg-ora hover:text-blue-700"
          onClick={() => navigate(`/cves/${cveId}`)}
        >
          {cveId}
        </button>
        <div>{item.cve.description}</div>
      </div>
      <div className="sm:w-1/4 flex">
        <div className="sm:w-1/2 p-2">
          <div>CVSS</div>
          <div>Published</div>
          <div>Updated</div>
        </div>
        <div className="sm:w-1/2 p-2">
          <div className="w-8 flex items-center">
            <p className={color}>{cvssBaseScore}</p>
          </div>
          <div>{item.cve.published_at.slice(0, 10)}</div>
          <div>{item.cve.updated_at.slice(0, 10)}</div>
        </div>
      </div>
    </div>
  );
};

export default CardCve;
