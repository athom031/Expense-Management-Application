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
    <div>
      <nav>
        <Link to="/summary" onClick={() => handleClick('/summary')} className={location.pathname === '/summary' ? 'active' : ''}>
          Summary
        </Link>
        <Link to="/user" onClick={() => handleClick('/user')} className={location.pathname === '/user' ? 'active' : ''}>
          User
        </Link>
        <Link to="/expenses" onClick={() => handleClick('/expenses')} className={location.pathname === '/expenses' ? 'active' : ''}>
          Expenses
        </Link>
        <Link to="/demo" onClick={() => handleClick('/demo')} className={location.pathname === '/demo' ? 'active' : ''}>
          Demo
        </Link>
      </nav>
    </div>
  );
}

export default NavBar;
