import { useState } from 'react';
import { createPortal } from 'react-dom';
import PortalModalContainer from './PortalModalContainer';

export default function PostForm({
  onSubmit,
  initialValues = { title: '', body: '' },
}) {
  const [title, setTitle] = useState(initialValues.title);
  const [body, setBody] = useState(initialValues.body);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, body });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <br />
      <button type="submit" onClick={() => setShowModal(true)}>
        submit
      </button>

      {showModal &&
        createPortal(
          <PortalModalContainer>
            <h3>저장 중...</h3>
          </PortalModalContainer>,
          document.body
        )}
    </form>
  );
}
