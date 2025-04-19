import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">HOME</Link> | <Link to="/posts">POSTS</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}
