import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../Css/DetailStory.css";

import { FaRegHeart, FaHeart } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit, FiArrowLeft } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { BsBookmarkPlus, BsThreeDots, BsBookmarkFill } from "react-icons/bs";
// import CommentSidebar from "../CommentScreens/CommentSidebar";
import Loader from "../components/generalScreen/Loader";
import { deletePost, getPostById } from "../apis/postApi";
import { getUserById } from "../apis/userApi";
import CommentSidebar from "../components/storyScreen/CommentSidebar";
import { getCommentsByPostId } from "../apis/commentApi";
import { createLike, deleteLike, getLikeByPostId } from "../apis/likeApi";

const PostDetail = () => {
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeUser, setActiveUser] = useState({});
  const [post, setPost] = useState({});
  const [storyLikeUser, setStoryLikeUser] = useState([]);
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const postId = useParams().postId;
  const [storyReadListStatus, setStoryReadListStatus] = useState(false);
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState(0);
  const [author, setAuthor] = useState("");
  const userId = localStorage.getItem("userId");
  const fetchActiveUser = async () => {
    try {
      const response = await getUserById(userId);
      setActiveUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getStoryComments = async () => {
    try {
      const { data } = await getCommentsByPostId(postId);
      if (data) {
        setCommentCount(data.length);
      }
    } catch (error) {
      console.log(error.response.data.error);
    }
  };
  const editDate = (createdAt) => {
    const d = new Date(createdAt);
    var datestring =
      d.toLocaleString("eng", { month: "long" }).substring(0, 3) +
      " " +
      d.getDate();
    return datestring;
  };
  const getDetailStory = async () => {
    setLoading(true);
    var activeUser = {};

    try {
      const { data } = await getPostById(postId);
      setPost(data);
      const user = await getUserById(data.author);
      setAuthor(user.data);
      setStoryLikeUser(data.data.likes);
      setLoading(false);
      // const story_id = data.data._id;

      // if (activeUser.readList) {
      //   if (!activeUser.readList.includes(story_id)) {
      //     setStoryReadListStatus(false);
      //   } else {
      //     setStoryReadListStatus(true);
      //   }
      // }
    } catch (error) {}
  };

  const handleDelete = async () => {
    try {
      await deletePost(postId)
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }
  const fetchCountLike = async () => {
    const response = await getLikeByPostId(postId);
    console.log(response.data);
    const isLikedArray = response.data.map((like) => {
      console.log(like);
      return like.userId == activeUser.id && like.postId == postId;
    });
    const isLiked = isLikedArray.some((liked) => liked);

    setLikeStatus(isLiked)
    setLikeCount(response.data.length);
  };
  useEffect(() => {
    getDetailStory();
    fetchActiveUser();
    getStoryComments();
    fetchCountLike();
  }, [commentCount, likeCount]);
  const data = { userId: activeUser.id, postId };
  const handleLike = async () => {
    if (likeStatus === false) {
      await createLike(data);
    } else {
      await deleteLike(data);
    }
    // setTimeout(() => {
    //   setLikeStatus(!likeStatus);
    // }, 1500);
    setLikeStatus(!likeStatus);
    fetchCountLike();
  };
  return (
    <>
      <>
        <div className="Inclusive-detailStory-page">
          <div className="top_detail_wrapper">
            <Link to={"/"}>
              <FiArrowLeft />
            </Link>
            <h5>{post.title}</h5>

            <div className="story-general-info">
              <ul>
                {post?.author && (
                  <li className="story-author-info">
                    <img
                      src={
                        "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg"
                      }
                      alt={post?.author?.username}
                    />
                    <span className="story-author-username">
                      {author?.username}
                    </span>
                  </li>
                )}
                <li className="story-createdAt">{editDate(post.createdAt)}</li>
              </ul>

              {/* {userId && (
                <div className="comment-info-wrap">
                  <i
                    onClick={(prev) => {
                      setSidebarShowStatus(!sidebarShowStatus);
                    }}
                  >
                    <FaRegComment />
                  </i>

                  <b className="commentCount">{post.commentCount}</b>
                </div>
              )} */}

              {activeUser &&
              post.author &&
              post.author == activeUser?.id ? (
                <div className="top_story_transactions">
                  <Link
                    className="editStoryLink"
                    to={`/post/${postId}/edit`}
                  >
                    <FiEdit />
                  </Link>
                  <span className="deleteStoryLink" onClick={handleDelete}>
                      <RiDeleteBin6Line />
                    </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="CommentFieldEmp">
            <CommentSidebar
              postId={postId}
              sidebarShowStatus={sidebarShowStatus}
              setSidebarShowStatus={setSidebarShowStatus}
              activeUser={activeUser}
            />
          </div>

          <div className="story-content">
            <div className="story-banner-img">
              <img src={`${post.image}`} alt={post.title} />
            </div>

            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>
          </div>
          {userId && (
            <div className="fixed-story-options">
              <ul>
                <li>
                  <i onClick={handleLike}>
                    {likeStatus ? <FaHeart color="#ff0000" /> : <FaRegHeart />}
                  </i>

                  <b
                    className="likecount"
                    style={
                      likeStatus
                        ? { color: "#0063a5" }
                        : { color: "rgb(99, 99, 99)" }
                    }
                  >
                    {" "}
                    {likeCount}
                  </b>
                </li>

                <li>
                  <i
                    onClick={(prev) => {
                      setSidebarShowStatus(!sidebarShowStatus);
                    }}
                  >
                    <FaRegComment />
                  </i>

                  <b className="commentCount">{commentCount}</b>
                </li>
              </ul>

              <ul>
                <li>
                  <i>
                    {storyReadListStatus ? (
                      <BsBookmarkFill color="#0205b1" />
                    ) : (
                      <BsBookmarkPlus />
                    )}
                  </i>
                </li>

                <li className="BsThreeDots_opt">
                  <i>
                    <BsThreeDots />
                  </i>

                  {/* {activeUser && post.author._id === activeUser._id ? (
                      <div className="delete_or_edit_story  ">
                        <Link
                          className="editStoryLink"
                          to={`/story/${post.slug}/edit`}
                        >
                          <p>Edit Story</p>
                        </Link>
                        <div className="deleteStoryLink" >
                          <p>Delete Story</p>
                        </div>
                      </div>
                    ) : null} */}
                </li>
              </ul>
            </div>
          )}
        </div>
      </>
    </>
  );
};

export default PostDetail;
