import React, { useState, useEffect, useRef } from "react";
import StoryComments from "./StoryComment";
import axios from "axios";
import AddComment from "./AddComment";
import { getCommentsByPostId } from "../../apis/commentApi";

const CommentSidebar = ({
  postId,
  sidebarShowStatus,
  setSidebarShowStatus,
  activeUser,
}) => {
  const [count, setCount] = useState(0);
  const [commentlist, setCommentList] = useState([]);

  const sidebarRef = useRef(null);

  const getStoryComments = async () => {
    try {
      const { data } = await getCommentsByPostId(postId);
      if (data) {
        setCommentList(data);
        setCount(data.length);
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  useEffect(() => {
    getStoryComments();
    const checkIfClickedOutside = (e) => {
      if (
        sidebarShowStatus &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarShowStatus(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [sidebarShowStatus,count]);
  return (
    <div
      ref={sidebarRef}
      className={
        sidebarShowStatus
          ? "Inclusive-comment-sidebar visible"
          : "Inclusive-comment-sidebar hidden "
      }
    >
      <div className="sidebar-wrapper">
        <AddComment
          setSidebarShowStatus={setSidebarShowStatus}
          slug={postId}
          getStoryComments={getStoryComments}
          activeUser={activeUser}
          count={count}
        />

        <StoryComments
          commentlist={commentlist}
          activeUser={activeUser}
          count={count}
          getStoryComments={getStoryComments}
        />
      </div>
    </div>
  );
};

export default CommentSidebar;
