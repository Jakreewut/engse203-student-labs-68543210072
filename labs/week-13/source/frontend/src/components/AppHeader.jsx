import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  ['/', 'Dashboard'],
  ['/requests/new', 'New Request'],
  ['/about', 'About'],
];

function AppHeader() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">ENGSE203 • LAB 13</p>
          <p className="brand">Campus Service Request</p>
        </div>
        <nav aria-label="เมนูหลัก">
          {links.map(([to, label]) => (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              end={to === '/'}
              key={to}
              to={to}
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="nav-link"
              style={{
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}
            >
              ออกจากระบบ ({user.name})
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              style={({ isActive }) =>
                !isActive
                  ? { background: 'white', color: 'var(--navy)', fontWeight: 800 }
                  : {}
              }
            >
              เจ้าหน้าที่
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;