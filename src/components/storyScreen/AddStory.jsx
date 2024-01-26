import React, { useRef, useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from "react-icons/ai";
import { FiArrowLeft } from "react-icons/fi";
import "../../Css/AddStory.css";
import { createPost } from "../../apis/postApi";

const AddStory = () => {
  // const { config } = useContext(AuthContext)
  const imageEl = useRef(null);
  const editorEl = useRef(null);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const [test, setTest] = useState({ imgFile: null, imgSrc: "" });
  console.log(userId);
  const clearInputs = () => {
    setTitle("");
    setContent("");
    setImage("");
    editorEl.current.editor.setData("");
    imageEl.current.value = "";
  };
  const navigate = useNavigate();
  const handleChangeFile = (e) => {
    // Lấy file từ event
    let file = e.target.files[0];
    setTest({ imgFile: file, imgSrc: "" });

    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png")
    ) {
      // Tạo đối tượng để đọc file
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setTest({ imgFile: file, imgSrc: e.target.result });
      };
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formdata = new FormData();
    // formdata.append("title", title);
    // formdata.append("image", image);
    // formdata.append("content", content);
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
    const img = !imageData.secure_url
      ? "https://4.bp.blogspot.com/-rTW8Zllh4TM/WAxaR7L6pkI/AAAAAAAAO-o/jE3YbAOGSTkD1M1Jmzvp0gxhP81gVHWUQCLcB/s1600/Post.png"
      : imageData.secure_url;
    const post = { content, title, image: img, author: userId };
    console.log(post);
    try {
      const response = await createPost(post);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    navigate("/");
    // try {
    //     const { data } = await axios.post("/story/addstory", formdata, config)
    //     setSuccess('Add story successfully ')

    //     clearInputs()
    //     setTimeout(() => {
    //         setSuccess('')
    //     }, 7000)

    // }
    // catch (error) {
    //     setTimeout(() => {
    //         setError('')

    //     }, 7000)
    //     setError(error.response.data.error)

    // }
  };
  return (
    <div className="Inclusive-addStory-page ">
      <Link to={"/"}>
        <FiArrowLeft />
      </Link>
      <form onSubmit={handleSubmit} className="addStory-form">
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
          ref={editorEl}
        />
        <div class="StoryImageField">
          <AiOutlineUpload />
          <div class="txt text-red-500">
            {image
              ? image.name
              : " Include a high-quality image in your story to make it more inviting to readers."}
          </div>
          <input
            name="image"
            type="file"
            ref={imageEl}
            onChange={(e) => {
              setImage(e.target.files[0]);
              handleChangeFile(e);
            }}
          />
        </div>
        <button
          type="submit"
          disabled={image ? false : true}
          className={image ? "addStory-btn" : "dis-btn"}
        >
          Publish{" "}
        </button>
      </form>
    </div>
  );
};

export default AddStory;
