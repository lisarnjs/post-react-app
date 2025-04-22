import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './index.css';
import { createPortal } from 'react-dom';
import { getPostById } from '../../apis/posts';
import PortalModalContainer from '../../components/PortalModalContainer';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getPostById(id).then((res) => setPost(res));
  }, [id]);

  if (!post) return <div className="PostDetailContainer">....Loading</div>;

  return (
    <div className="PostDetailContainer">
      <h2>Post Id : {id}</h2>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <div className="btns">
        <Link to={`/posts/${post.id}/edit`}>Edit</Link>
        <button onClick={() => setShowModal(true)}>즐겨찾기</button>
      </div>

      {showModal &&
        createPortal(
          <PortalModalContainer>
            <h3>
              로컬스토리지를 활용하여 자유롭게 즐겨찾기 기능을 구현해보세요.
            </h3>
            <button onClick={() => setShowModal(false)}>닫기</button>
          </PortalModalContainer>,
          document.body
        )}
    </div>
  );
}
