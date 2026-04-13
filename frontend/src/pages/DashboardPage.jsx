import { useEffect, useState } from 'react';
import { clientService } from '../services/clientService';
import { membershipService } from '../services/membershipService';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeMemberships: 0,
    expiredMemberships: 0,
  });
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, activeRes, expiredRes] = await Promise.all([
          clientService.getAll(),
          membershipService.getAll('activa'),
          membershipService.getAll('vencida'),
        ]);
        setStats({
          totalClients: clientsRes.data.length,
          activeMemberships: activeRes.data.length,
          expiredMemberships: expiredRes.data.length,
        });
        setRecentClients(clientsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Error cargando dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;

  const statusBadge = (status) => {
    const map = {
      'ACTIVA':        <span className="badge badge-success">Activa</span>,
      'VENCIDA':       <span className="badge badge-danger">Vencida</span>,
      'SIN MEMBRESÍA': <span className="badge badge-secondary">Sin membresía</span>,
    };
    return map[status] || <span className="badge badge-secondary">{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general del sistema</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-label">Total Clientes</div>
          <div className="stat-value">{stats.totalClients}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-label">Membresías Activas</div>
          <div className="stat-value">{stats.activeMemberships}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-label">Membresías Vencidas</div>
          <div className="stat-value">{stats.expiredMemberships}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Clientes recientes</h2>
        </div>
        <div className="table-wrapper">
          {recentClients.length === 0 ? (
            <div className="empty-state">
              <p>No hay clientes registrados aún.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Membresía</th>
                </tr>
              </thead>
              <tbody>
                {recentClients.map(client => (
                  <tr key={client.id}>
                    <td style={{ fontWeight: 500 }}>{client.name} {client.lastName}</td>
                    <td>{client.email || '—'}</td>
                    <td>{client.phone || '—'}</td>
                    <td>{statusBadge(client.membershipStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
