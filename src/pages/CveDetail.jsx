import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCveById } from "../apis/cveApi";
import { getCvssByCveId } from "../apis/cvssApi";
import { getCweById, getCweIdByCveId } from "../apis/cweApi";
import { getCpeByCveId } from "../apis/cpeApi";

const CveDetail = () => {
  const { cveId } = useParams();
  const [cve, setCve] = useState();
  const [cvss, setCvss] = useState();
  const [cwes, setCwes] = useState([]);
  const [dataCpe, setDataCpe] = useState([]);
  const [data, setData] = useState([]);
  const fetchCve = async () => {
    const response = await getCveById(cveId);
    setCve(response.cve);
  };
  const fetchCvss = async () => {
    try {
      const response = await getCvssByCveId(cveId);
      setCvss(response.cvss[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCwes = async () => {
    try {
      const response = await getCweIdByCveId(cveId);
      const cweData = await Promise.all(
        response.data.map(async (item) => {
          const response1 = await getCweById(item.cweId);
          return {
            id: response1?.data[0]?.id || "",
            name: response1?.data[0]?.name || "",
            description: response1?.data[0]?.description || "",
          };
        })
      );
      setData(cweData);
      setCwes(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCpes = async () => {
    try {
      const response = await getCpeByCveId(cveId);
      setDataCpe(response.data);
    } catch (error) {}
  };

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
  const es = getColorByScore(cvss?.exploitability_score);
  const is = getColorByScore(cvss?.impact_score);
  useEffect(() => {
    const fetchDataAndLogs = async () => {
      await fetchCve();
      await fetchCvss();
      await fetchCwes();
      await fetchCpes();
      // await fetchData();
    };

    fetchDataAndLogs();
  }, [cveId]);
  console.log(data);
  const navigate = useNavigate();
  return (
    <div className="flex  items-center justify-center">
      <div className="w-3/5">
        <div className="flex flex-row ">
          <p className="text-xl font-semibold">Vulnerability Details : </p>
          <p className="text-xl ml-1 mb-3 text-blue-500 font-bold">
            {" "}
            {cve?.id}
          </p>
        </div>
        <div className="bg-gray-100 p-3 pb-10 rounded ">
          <p>{cve?.description}</p>
        </div>
        <div>
          <p className="text-gray-500 mt-2">
            Published{" "}
            {cve?.published_at.slice(0, 10) +
              " " +
              cve?.published_at.slice(11, 19)}{" "}
            Updated{" "}
            {cve?.updated_at.slice(0, 10) + " " + cve?.updated_at.slice(11, 19)}
          </p>
          <p className="text-gray-500 mt-1">Vulnerability category : </p>
        </div>
        <div>
          <p className="font-semibold text-lg mt-2 mb-2 border-b-2 pb-2">
            CVSS scores for {cveId}
          </p>
          <div>
            <table>
              <thead className="text-gray-500">
                <tr className="grid grid-cols-8">
                  <th className="">Base Score</th>
                  <th>Base Severity</th>
                  <th className="col-span-3">CVSS Vector</th>
                  <th>Exploitability Score</th>
                  <th>Impact Score</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="grid grid-cols-8">
                  <th className="pl-9 pr-9">
                    <p className={color}>{cvss?.base_score}</p>
                  </th>
                  <th>{cvss?.base_severity}</th>
                  <th className="col-span-3 text-blue-500">
                    {cvss?.cvss_vector}
                  </th>
                  <th className="pl-9 pr-9">
                    <p className={es}>{cvss?.exploitability_score}</p>
                  </th>
                  <th className="pl-9 pr-9">
                    <p className={is}>{cvss?.impact_score}</p>
                  </th>
                  <th>{cvss?.source}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <p className="font-semibold text-lg mt-4 mb-2">
            CWE ids scores for {cveId}
          </p>
          {data.map((item) => (
            <div>
              <button
                className="flex flex-row text-sm text-blue-500 ml-3"
                onClick={() => navigate(`/cwes/${item.id}`)}
              >
                <p className="mr-1">{item.id}</p>
                <p>{item.name}</p>
              </button>
              <p className="ml-4 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <p className="font-semibold text-lg mt-4 mb-2">
            Products affected by {cveId}
          </p>
          {dataCpe.map((item, index) => (
            <div
              className={`w-3/5 pb-1 ${
                index !== dataCpe.length - 1 ? "border-b-2 " : ""
              }`}
            >
              <div className="flex flex-row text-sm text-blue-500 ml-3">
                <p className="mr-1">{item.version}</p>
              </div>
              <p className="ml-4 text-sm">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CveDetail;
