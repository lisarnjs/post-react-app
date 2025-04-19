import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostById, updatePost } from "../../apis/posts";
import PostForm from "../../components/PostForm";
import "./index.css";

export default function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPostById(id).then((res) => setPost(res));
  }, [id]);

  // {title: '', body: ''}
  const handleUpdate = async (data) => {
    await updatePost(id, data).then((res) => console.log(res));
    navigate(`/posts/${id}`);
  };

  if (!post) return <div className="postFormContainer">....Loading</div>;
  return (
    <div className="postFormContainer">
      <h2>Edit Post Id : {id}</h2>
      <p className="lastEditPostIdText">
        마지막으로 수정한 post id : id값을 보여주세요.
      </p>

      <PostForm onSubmit={handleUpdate} initialValues={post} />
    </div>
  );
}
