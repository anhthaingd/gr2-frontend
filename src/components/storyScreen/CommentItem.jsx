import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import {
  MdOutlineWavingHand,
  MdWavingHand,
  MdDeleteOutline,
} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById } from "../../apis/postApi";
import { deleteComment } from "../../apis/commentApi";

const CommentItem = ({ comment, activeUser, getStoryComments, count }) => {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [likeStatus, setLikeStatus] = useState(false);
  const [au, setAu] = useState("");
  const [post, setPost] = useState({});
  const postId = useParams().postId;
  useEffect(() => {
    const getDetailStory = async () => {
      const response = await getPostById(postId);
      setPost(response.data);
    };
    getDetailStory();
  }, []);

  const editDate = (createdAt) => {
    const d = new Date(createdAt);
    var datestring =
      d.toLocaleString("eng", { month: "long" }).substring(0, 3) +
      " " +
      d.getDate();
    return datestring;
  };
  const handleDeleteComment = async () => {
    const comment_id = comment.id;
    console.log(comment_id);
    try {
      await deleteComment(comment_id);
      setTimeout(() => {
        document.querySelector(".commentCount").textContent = count - 1;
      }, 650);
      getStoryComments();
    } catch (error) {
      console.log("delete fail");
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-top-block">
        <section>
          <img
            src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg"
            alt={comment.user?.username}
            width="35"
          />

          <div>
            <span className="comment-author-username">
              {comment.user?.username}
            </span>
            <span className="comment-createdAt">
              {editDate(comment.createdAt)}
            </span>
          </div>
        </section>

        <section>
          {activeUser?.id === post?.author ? (
            <MdDeleteOutline onClick={() => handleDeleteComment()} />
          ) : null}
        </section>
      </div>

      <div className="comment-content">
        <span dangerouslySetInnerHTML={{ __html: comment.content }}></span>
      </div>

      <div className="comment-bottom-block">
        <div className="commentLike-wrapper">
          {/* <i className="biLike" onClick={() => handleCommentLike()}>
            {likeStatus ? <MdWavingHand /> : <MdOutlineWavingHand />}
          </i> */}
        </div>

        <div className="comment-star flex">
          {[...Array(5)].map((_, index) => {
            return (
              <FaStar
                key={index}
                className="star"
                size={15}
                color={comment.star > index ? "#0205b1" : "grey"}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
