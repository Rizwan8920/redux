import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, selectAddStatus } from "../features/postSlice";
import Feed from "../components/Feed";

function Post() {
  const dispatch = useDispatch();
  const addStatus = useSelector(selectAddStatus);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formError, setFormError] = useState(null);

  const canSubmit = title.trim() && body.trim() && addStatus !== "loading";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      await dispatch(addPost({ title, body, userId: 1 })).unwrap();
      setTitle("");
      setBody("");
      setFormError(null);
    } catch (err) {
      console.log(err);
      setFormError(err);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          name="postBody"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" disabled={!canSubmit}>
          {addStatus === "loading" ? "Saving..." : "Add post"}
        </button>
        {formError && <p style={{ color: "red" }}>{formError}</p>}
      </form>

      <Feed />
    </>
  );
}

export default Post;
