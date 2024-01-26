import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCapecById } from "../apis/capecApi";
import { getCweByCapecId, getCweById } from "../apis/cweApi";

const CapecDetail = () => {
  const { capecId } = useParams();
  const [capec, setCapec] = useState([]);
  const [cweData, setCweData] = useState([]);
  const navigate = useNavigate();
  const fetchCapec = async () => {
    try {
      const response = await getCapecById(capecId);
      setCapec(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const fetCwe = async () => {
    try {
      const response = await getCweByCapecId(capecId);
      const data = await Promise.all(
        response.data.map(async (item) => {
          const res = await getCweById(item.cweId);

          return {
            id: res?.data[0]?.id || "",
            name: res?.data[0]?.name || "",
          };
        })
      );
      const filteredData = data.filter((item) => item.id !== "");
      setCweData(filteredData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCapec();
    fetCwe();
  }, []);
  var trimmedStrings = capec.mitigations?.replace(/"/g, "");
  trimmedStrings = trimmedStrings?.replace(/\[\]/g, "");
  return (
    <div className="App flex justify-center">
      <div className="w-3/5">
        <header className="text-2xl text-red-800 font-bold p-2">
          {capec.id}: {capec.name}
        </header>
        <div className="flex flex-col mb-1">
          <div className="title">Description</div>
          <div>{capec.description}</div>
        </div>
        <div className="flex flex-col mb-1">
          <div className="title">Extended Description</div>
          <div>{capec.extended_description}</div>
        </div>
        <div className="flex flex-col mb-1">
          <div className="title">Likelihood Of Attack</div>
          <div>{capec.likelihood_of_attack}</div>
        </div>
        <div className="flex flex-col mb-1">
          <div className="title">Typical Severity</div>
          <div>{capec.typical_severity}</div>
        </div>

        <div className="flex flex-col mb-1">
          <div className="title">Mitigations</div>
          <div>{trimmedStrings?.slice(1, trimmedStrings.length - 1)}</div>
        </div>

        <div className="flex flex-col mb-1">
          <div className="title">Related Weaknesses</div>
          <div className="p-2 ">
            <table className="w-full border-gray-200 border-[1px]">
              <thead className="bg-blue-200 text-blue-900 font-bold">
                <td className="col w-1/6">CWE-ID</td>
                <td className="col w-5/6">Attack Pattern Name</td>
              </thead>
              <tbody>
                {cweData.map((i) => (
                  <tr>
                    <td
                      className="col w-1/6  text-blue-700 cursor-pointer"
                      onClick={() => navigate(`/cwes/${i?.id}`)}
                    >
                      {i?.id}
                    </td>
                    <td className="col w-5/6">{i?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapecDetail;
