import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../axios/axiosInstance";
import { ADMIN_POST_ACCESS } from "../../../../constants/admin_urls";
import { Avatar } from "@nextui-org/react";
import { IMAGE_URL } from "../../../../constants/urls";
import avatar from "../../../../assets/images/avatar.jpg";
import { useNavigate } from "react-router-dom";

function PostReportList() {
  const [reports, setReports] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [skelton, setSkelton] = useState(false)
  const navigate = useNavigate();

  const viewReport = (report_id) => {
    navigate(`/admin/reports/posts/${report_id}`);
  };

  const fetchPostReports = () => {
    setSkelton(true)
    axiosInstance
      .get(`${ADMIN_POST_ACCESS}/get_post_reports/1`)
      .then((res) => {
        console.log("res from post reports list", res);
        setReports(res?.data?.reports);
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      })
      .catch((err) => {
        console.log("res from post reports list : ", err);
      })
      .finally(() => {
        setSkelton(false)
      });
  };

  useEffect(() => {
    fetchPostReports();
  }, []);

  return (
    <>
      <div className="flex w-full overflow-x-auto">
        <table className="table-hover table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Report ID</th>
              <th>Reported by</th>
              <th>Report Date</th>
            </tr>
          </thead>
          <tbody>
          {skelton && (
              <>
                <td class="animate-pulse">
                  <div class="h-8 p-2 bg-gray-200 mt-3 mx-4 mb-6 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-200 mb-6 mx-4 rounded"></div>
                </td>
                <td class="animate-pulse">
                  <div class="h-8 p-2 bg-gray-200 mt-3 mx-4 mb-6 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-200 mb-6 mx-4 rounded"></div>
                </td>
                <td class="animate-pulse">
                  <div class="h-8 p-2 bg-gray-200 mt-3 mx-4 mb-6 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-200 mb-6 mx-4 rounded"></div>
                </td>
                <td class="animate-pulse">
                  <div class="h-8 p-2 bg-gray-200 mt-3 mx-4 mb-6 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-200 mb-6 mx-4 rounded"></div>
                </td>
              </>
            )}
            {!skelton && reports &&
              reports.map((report, index) => (
                <tr key={report?.report_id} onClick={()=>viewReport(report?.report_id)}>
                  <th>{index + 1}</th>
                  <td>{report?.report_id}</td>
                  <td className="flex items-center">
                    <Avatar
                      src={
                        report?.reporter.profile_picture
                          ? `${IMAGE_URL}${report?.reporter.profile_picture}`
                          : avatar
                      }
                    />
                    <p className="ml-3">{report?.reporter?.name}</p>
                  </td>
                  <td>{report?.reported_at}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
          {!skelton && reports.length == 0 && (
            <div className="flex justify-center items-center w-full h-full p-10">
              <h1 className="font-medium text-xl">No reports pending to update </h1>
            </div>
          )}
    </>
  );
}

export default PostReportList;
