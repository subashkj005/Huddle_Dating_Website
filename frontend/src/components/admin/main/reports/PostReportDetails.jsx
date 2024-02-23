import React, { useEffect, useState } from "react";
import { ADMIN_POST_ACCESS } from "../../../../constants/admin_urls";
import { useParams } from "react-router-dom";
import { Avatar, Button } from "@nextui-org/react";
import useravatar from "../../../../assets/images/avatar.jpg";
import axiosInstance from "../../../../axios/axiosInstance";
import { IMAGE_URL } from "../../../../constants/urls";
import PostFeedView from './PostFeedView'



function PostReportDetails() {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [postAuthor, setPostAuthor] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`${ADMIN_POST_ACCESS}/get_post_report/${reportId}`)
      .then((res) => {
        setReport(res?.data?.report);
        setPost(res?.data?.report?.reported_post);
        setComments(res?.data?.report?.reported_post?.comments || [])
        setPostAuthor(res?.data?.report?.reported_post?.author)

        // console.log("res in report details", res);
      })
      .catch((err) => {
        console.log("error at getting report details : ", err);
      });
  }, []);

  return (
    <>
      {report ? (
        <>
          {" "}
          <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg shadow-md">
            {/* Left Div */}
            <div className="flex items-center">
              {/* User Image */}
              <div className="relative w-20 h-20">
                <Avatar
                  size="lg"
                  src={
                    report?.reported_by?.profile_picture
                      ? `${IMAGE_URL}${report?.reported_by?.profile_picture}`
                      : useravatar
                  }
                />
              </div>
              {/* User Details */}
              <div>
                <h2 className="text-lg font-sans font-medium">
                  Reporter:{" "}
                  <p className="text-ellipsis font-sans font-normal">
                    {report.reported_by?.name}
                  </p>
                </h2>
                <h2 className="text-lg font-sans font-medium ">
                  Reported at:{" "}
                  <p className="text-ellipsis font-sans font-normal max-w-[10rem]">
                    {report?.reported_at}
                  </p>
                </h2>
              </div>
            </div>
            <div>
              <h2 className="text-sm  text-ellipsis max-w-[30rem] font-medium text-black">
                Reason:
                <p className="text-ellipsis font-sans font-normal">
                  {report?.reason}
                </p>
              </h2>
            </div>
          </div>
          <div className="border w-full h-full p-10 mt-5 rounded shadow-md">
                <PostFeedView post={post} comments={comments} postAuthor={postAuthor} report_id={report?.id} />

          </div>
        </>
      ) : (
        <div className="animate-pulse">
          <div className="h-16 p-2 bg-gray-200 mt-3 mx-4 mb-6 rounded"></div>
        </div>
      )}
    </>
  );
}

export default PostReportDetails;
