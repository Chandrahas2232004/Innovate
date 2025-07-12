import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const authLinks = (
    <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
      <li>
        <Link to="/ideas" onClick={closeMenu}>Ideas</Link>
      </li>
      <li>
        <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
      </li>
      {user && user.role === 'startuper' && (
        <li>
          <Link to="/create-idea" onClick={closeMenu}>
            <i className="fas fa-plus"></i> <span className="hide-sm">Create Idea</span>
          </Link>
        </li>
      )}
      <li>
        <a onClick={() => { logout(); closeMenu(); }} href="#!">
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
      <li>
        <Link to="/ideas" onClick={closeMenu}>Ideas</Link>
      </li>
      <li>
        <Link to="/register" onClick={closeMenu}>Register</Link>
      </li>
      <li>
        <Link to="/login" onClick={closeMenu}>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <div className="navbar-brand">
        <h1>
          <Link to="/" onClick={closeMenu}>
            <i className="fas fa-seedling"></i> RuralInnovate
          </Link>
        </h1>
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;

