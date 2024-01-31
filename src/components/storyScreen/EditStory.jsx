import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Loader from "../generalScreen/Loader";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AiOutlineUpload } from "react-icons/ai";
import "../../Css/EditStory.css";
import { editPost, getPostById } from "../../apis/postApi";

const EditStory = () => {
  const postId = useParams().postId;
  const imageEl = useRef(null);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState({});
  const [image, setImage] = useState("");
  const [previousImage, setPreviousImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [currentImage, setCurrentImage] = useState();
  const fetchPost = async () => {
    const response = await getPostById(postId);
    setStory(response.data);
    setTitle(response.data.title);
    setContent(response.data.content);
    setCurrentImage(response.data.image);
  };
  useEffect(() => {
    // const getStoryInfo = async () => {
    //     setLoading(true)
    //     try {
    //         const { data } = await axios.get(`/story/editStory/${slug}`, config)
    //         setStory(data.data)
    //         setTitle(data.data.title)
    //         setContent(data.data.content)
    //         setImage(data.data.image)
    //         setPreviousImage(data.data.image)
    //         setLoading(false)
    //     }
    //     catch (error) {
    //         navigate("/")
    //     }
    // }
    // getStoryInfo()
    fetchPost();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "jay3krzh");
    data.append("cloud_name", "dshzlfayf");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dshzlfayf/image/upload",
      {
        method: "post",
        body: data,
      }
    );
    const imageData = await res.json();
    const img = !imageData.secure_url ? currentImage : imageData.secure_url;
    const post = { content, title, image: img, author: userId };
    try {
      await editPost(postId, post);
      navigate(`/post/${postId}`);
    } catch (error) {
      console.log(error);
    }

    // try {
    //     const { data } = await axios.put(`/story/${slug}/edit`, formdata, config)

    //     setSuccess('Edit Story successfully ')

    //     setTimeout(() => {
    //         navigate('/')
    //     }, 2500)

    // }
    // catch (error) {
    //     setTimeout(() => {
    //         setError('')
    //     }, 4500)
    //     setError(error.response.data.error)
    // }
  };

  return (
    <>
      {
        <div className="Inclusive-editStory-page ">
          <form onSubmit={handleSubmit} className="editStory-form">
            {error && <div className="error_msg">{error}</div>}
            {success && (
              <div className="success_msg">
                <span>{success}</span>
                <Link to="/">Go home</Link>
              </div>
            )}

            <input
              type="text"
              required
              id="title"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />

            <CKEditor
              editor={ClassicEditor}
              onChange={(e, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
              data={content}
            />

            <div class="currentlyImage">
              <div class="absolute">Currently Image</div>
              <img src={`${currentImage}`} alt="storyImage" className="" />
            </div>
            <div class="StoryImageField mt-24">
              <AiOutlineUpload />
              <div class="txt">
                {image === previousImage
                  ? "    Change the image in your story "
                  : image.name}
              </div>
              <input
                name="image"
                type="file"
                ref={imageEl}
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
            </div>

            <button type="submit" className="editStory-btn">
              Edit Story{" "}
            </button>
          </form>
        </div>
      }
    </>
  );
};

export default EditStory;
