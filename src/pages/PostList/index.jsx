import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { deletePost, getAllPosts } from "../../apis/posts";
import "./index.css";
import PortalModalContainer from "../../components/PortalModalContainer";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getAllPosts().then((res) => {
      console.log(res);
      setPosts(res);
    });
  }, []);

  async function handleDelete() {
    if (openModal === null) return;

    setIsDeleting(true);

    try {
      await deletePost(openModal);
      setPosts((prev) => prev.filter((p) => p.id !== openModal));
    } catch (err) {
      console.log("failed to delete post : ", err);
    } finally {
      setIsDeleting(false);
      setOpenModal(null);
    }
  }

  return (
    <section className="postListSection">
      <h3>Posts List</h3>
      <ul>
        {posts.map((post) => (
          <li>
            <Link to={`/posts/${post.id}`}>
              {post.id}. {post.title}
            </Link>

            <button onClick={() => setOpenModal(post.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {openModal &&
        createPortal(
          <PortalModalContainer>
            <div className="deleteModal">
              <h3>Are you sure you want to delete id={openModal} post?</h3>
              <div className="btns">
                <button onClick={handleDelete} disabled={isDeleting}>
                  Yes
                </button>
                <button
                  onClick={() => setOpenModal(null)}
                  disabled={isDeleting}
                >
                  No
                </button>
              </div>
            </div>
          </PortalModalContainer>,
          document.body
        )}
    </section>
  );
}
