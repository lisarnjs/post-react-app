import { useState } from 'react';
import './index.css';
import { createPortal } from 'react-dom';
import PortalModalContainer from '../../components/PortalModalContainer';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <div className="home">
      <h3>Welcome To Main Page!</h3>
      <button onClick={() => setShowLoginModal(true)}>로그인</button>

      {showLoginModal &&
        createPortal(
          <PortalModalContainer>
            <div className="loginModalInner">
              <p>
                해당 모달에서 로그인 정보를 입력받고 자유롭게 로그인 기능을
                만들어 주세요.
              </p>
              <input placeholder="id : test123" />
              <input placeholder="pw : test123password" />
              <div className="btns">
                <button>로그인</button>
                <button onClick={() => setShowLoginModal(false)}>취소</button>
              </div>
            </div>
          </PortalModalContainer>,
          document.body
        )}
    </div>
  );
}
