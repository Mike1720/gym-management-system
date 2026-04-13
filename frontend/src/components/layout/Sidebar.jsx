import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/clients',   label: 'Clientes',   icon: '👥' },
  { to: '/memberships', label: 'Membresías', icon: '🏋️' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🏋️ GymManager</h2>
        <p>Sistema de gestión</p>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>Sesión activa</div>
          <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{user?.username}</div>
        </div>
        <button className="nav-link" onClick={handleLogout}>
          <span>🚪</span> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
