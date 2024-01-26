import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCweById,
  getDetectByCweId,
  getMitigationByCweId,
  getObservedByCweId,
} from "../apis/cweApi";
import { getCapecByCweId, getCapecById } from "../apis/capecApi";
const CweDetail = () => {
  const [cwe, setCwe] = useState("");
  const { cweId } = useParams();
  const [observed, setObserved] = useState([]);
  const [mitigation, setMitigation] = useState([]);
  const [detect, setDetect] = useState([]);
  const [capecs, setCapecs] = useState([]);
  const [data, setData] = useState([]);
  const fetchCwe = async () => {
    try {
      const response = await getCweById(cweId);
      setCwe(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchObserved = async () => {
    try {
      const response = await getObservedByCweId(cweId);
      setObserved(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMitigation = async () => {
    try {
      const response = await getMitigationByCweId(cweId);
      setMitigation(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDetect = async () => {
    try {
      const response = await getDetectByCweId(cweId);
      setDetect(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCapec = async () => {
    try {
      const response = await getCapecByCweId(cweId);
      const capecData = await Promise.all(
        response.data.map(async (item) => {
          const response = await getCapecById(item.capecId);
  
          return {
            id: response?.data[0]?.id || "",
            name: response?.data[0]?.name || "",
          };
        })
      );
      setData(capecData);
      setCapecs(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    const capecData = await Promise.all(
      capecs.map(async (item) => {
        const response = await getCapecById(item.capecId);

        return {
          id: response?.data[0]?.id || "",
          name: response?.data[0]?.name || "",
        };
      })
    );
    setData(capecData);
  };
  useEffect(() => {
    fetchCwe();
    fetchObserved();
    fetchMitigation();
    fetchDetect();
    fetchCapec();
    // fetchData();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="App flex justify-center">
      <div className="w-3/5">
        <header className="text-2xl text-red-800 font-bold p-2">
          {cwe.id}: {cwe.name}
        </header>
        <div className="flex flex-col mb-1">
          <div className="title">Description</div>
          <div>{cwe.description}</div>
        </div>
        <div className="flex flex-col mb-1">
          <div className="title">Extended Description</div>
          <div>{cwe.extended_description}</div>
        </div>
        <div className="flex flex-col mb-1">
          <div className="title">Observed Examples</div>
          <div className="p-2">
            <table className="w-full border-gray-200 border-[1px]">
              <thead className="bg-blue-200 text-blue-900 font-bold">
                <td className="col w-1/5">Reference</td>
                <td className="col w-4/5">Description</td>
              </thead>
              <tbody>
                {observed.map((i) => (
                  <tr>
                    <td
                      className="col w-1/5 text-blue-700 cursor-pointer "
                      onClick={() => navigate(`/cves/${i.name}`)}
                    >
                      {i?.name}
                    </td>
                    <td className="col w-4/5">{i?.des}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col mb-1">
          <div className="title">Potential Mitigations</div>
          {mitigation?.map((a) => (
            <div className="flex flex-col justify-center border-b-[1px] border-dashed border-blue-400 p-1">
              <div className="pl-2">
                <p className="text-xl text-blue-700 font-bold">
                  {a.subheading}
                </p>
                <div className="pl-2 pr-2">
                  <p>{a.des.slice(2, a.des.length - 2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col mb-1">
          <div className="title">Detect Methods</div>
          {detect.map((a) => (
            <div className="flex flex-col justify-center border-b-[1px] border-dashed border-blue-400 p-1">
              <div className="pl-2">
                <p className="text-xl text-blue-700 font-bold">
                  {a.subheading}
                </p>
                <div className="pl-2 pr-2">
                  <p>{a.des.slice(2, a.des.length - 2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col mb-1">
          <div className="title">Related Attack Patterns</div>
          <div className="p-2 ">
            <table className="w-full border-gray-200 border-[1px]">
              <thead className="bg-blue-200 text-blue-900 font-bold">
                <td className="col w-1/6">CAPEC-ID</td>
                <td className="col w-5/6">Attack Pattern Name</td>
              </thead>
              <tbody>
                {data.map((i) => (
                  <tr>
                    <td
                      className="col w-1/6  text-blue-700 cursor-pointer"
                      onClick={() => navigate(`/capecs/${i?.id}`)}
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

export default CweDetail;
