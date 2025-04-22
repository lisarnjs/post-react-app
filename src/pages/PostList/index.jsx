import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { deletePost, getAllPosts } from '../../apis/posts';
import './index.css';
import PortalModalContainer from '../../components/PortalModalContainer';

export default function PostList() {
  const [posts, setPosts] = useState([]); // 전체 posts 상태
  const [visiblePosts, setVisiblePosts] = useState([]); // 화면에 보일 posts 상태
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 더 이상 가져올 데이터가 있는지 여부

  const [openModal, setOpenModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loaderRef = useRef(); // 스크롤 끝을 감지하는 ref
  const previousLastPostIndex = visiblePosts.length - 10;

  // 전체 데이터를 한번에 가져오는 useEffect
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // 강제로 로딩을 일정 시간 동안 보이게 하기 위해 setTimeout 사용
      setTimeout(async () => {
        try {
          const res = await getAllPosts(); // API 호출
          setPosts(res); // 모든 포스트 데이터 저장
          setVisiblePosts(res.slice(0, 10)); // 처음 10개 데이터 표시
          setHasMore(res.length > 10); // 10개 이상이면 더 불러올 데이터가 있다는 의미
        } catch (err) {
          console.log('Failed to fetch posts:', err);
        } finally {
          setIsLoading(false);
        }
      }, 1000); // 1초 동안 로딩을 보이게 설정
    };

    loadData();
  }, []);

  // 무한 스크롤 기능: 끝에 도달하면 데이터를 추가로 불러오는 useEffect
  useEffect(() => {
    const target = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          // 스크롤이 끝에 도달하면
          const nextPosts = posts.slice(
            visiblePosts.length,
            visiblePosts.length + 10
          );

          setVisiblePosts((prev) => [...prev, ...nextPosts]); // 기존 목록에 추가
          setHasMore(posts.length > visiblePosts.length + 10); // 더 이상 불러올 데이터가 없으면 hasMore false
        }
      },
      { threshold: 1 }
    );

    if (target) {
      observer.observe(target); // 끝을 감지하는 요소를 관찰
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [visiblePosts, posts, hasMore, isLoading]);

  // 삭제 처리
  async function handleDelete() {
    if (openModal === null) return;

    setIsDeleting(true);

    try {
      await deletePost(openModal);
      setPosts((prev) => prev.filter((p) => p.id !== openModal));
      setVisiblePosts((prev) => prev.filter((p) => p.id !== openModal)); // 화면에서 삭제된 포스트도 제거
    } catch (err) {
      console.log('Failed to delete post:', err);
    } finally {
      setIsDeleting(false);
      setOpenModal(null);
    }
  }

  return (
    <section className="postListSection">
      <h3>Posts List</h3>
      <ul>
        {visiblePosts.map((post, index) => (
          <li
            key={post.id}
            className={previousLastPostIndex <= index && 'slowlyShow'}
          >
            <Link to={`/posts/${post.id}`}>
              {post.id}. {post.title}
            </Link>

            <button type="button" onClick={() => setOpenModal(post.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>} {/* 로딩 중 메시지 */}
      {hasMore && (
        <div ref={loaderRef} style={{ height: '30px', marginBottom: '10px' }} /> // 로딩을 위한 감지용 div
      )}
      {openModal &&
        createPortal(
          <PortalModalContainer>
            <div className="deleteModal">
              <h3>Are you sure you want to delete id={openModal} post?</h3>
              <div className="btns">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  Yes
                </button>
                <button
                  type="button"
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
