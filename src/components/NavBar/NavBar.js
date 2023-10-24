import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div>
        <nav>
            <Link to="/summary">Summary</Link>
            <Link to="/user">User</Link>
            <Link to="/expenses">Expenses</Link>
            <Link to="/demo">Demo</Link>
        </nav>
    </div>
  );
}

export default NavBar;
