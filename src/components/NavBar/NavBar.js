import './NavBar.css';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();

  const handleClick = (path) => {
    if (path === location.pathname) {
      window.location.reload(); // Reload the window if the path matches the current location
    }
  };

  return (
    <div className="nav-bar">
      <nav>
        <Link to="/summary" onClick={() => handleClick('/summary')} className={`nav-link ${location.pathname === '/summary' ? 'active' : ''}`}>
          Summary
        </Link>
        <Link to="/user" onClick={() => handleClick('/user')} className={`nav-link ${location.pathname === '/user' ? 'active' : ''}`}>
          User
        </Link>
        <Link to="/expenses" onClick={() => handleClick('/expenses')} className={`nav-link ${location.pathname === '/expenses' ? 'active' : ''}`}>
          Expenses
        </Link>
      </nav>
    </div>
  );
}

export default NavBar;
