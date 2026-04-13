import { useState, useEffect, useCallback } from 'react';
import { membershipService } from '../services/membershipService';
import MembershipModal from '../components/memberships/MembershipModal';

const TYPE_LABELS = {
  MENSUAL: 'Mensual',
  TRIMESTRAL: 'Trimestral',
  SEMESTRAL: 'Semestral',
  ANUAL: 'Anual',
};

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [feedback, setFeedback]       = useState('');

  const load = useCallback(async (status = '') => {
    setLoading(true);
    try {
      const res = await membershipService.getAll(status);
      setMemberships(res.data);
    } catch {
      setFeedback('Error al cargar las membresías');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(filter); }, [load, filter]);

  const handleSave = async (form) => {
    await membershipService.create(form);
    setModalOpen(false);
    setFeedback('Membresía registrada correctamente');
    load(filter);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta membresía?')) return;
    try {
      await membershipService.delete(id);
      setFeedback('Membresía eliminada');
      load(filter);
      setTimeout(() => setFeedback(''), 3000);
    } catch {
      setFeedback('Error al eliminar la membresía');
    }
  };

  const FILTERS = [
    { value: '',        label: 'Todas' },
    { value: 'activa',  label: 'Activas' },
    { value: 'vencida', label: 'Vencidas' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Membresías</h1>
          <p>Control de pagos y vencimientos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + Nueva membresía
        </button>
      </div>

      {feedback && (
        <div className={`alert ${feedback.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {feedback}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Membresías ({memberships.length})</h2>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`filter-tab ${filter === f.value ? 'active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : memberships.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 40 }}>🏋️</div>
              <p>No hay membresías {filter ? `(${filter}s)` : ''} registradas.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Inicio</th>
                  <th>Vencimiento</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 500 }}>{m.clientName}</td>
                    <td>{TYPE_LABELS[m.type] || m.type}</td>
                    <td>{new Date(m.startDate + 'T00:00:00').toLocaleDateString('es-MX')}</td>
                    <td>{new Date(m.endDate + 'T00:00:00').toLocaleDateString('es-MX')}</td>
                    <td>${Number(m.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    <td>
                      {m.active
                        ? <span className="badge badge-success">Activa</span>
                        : <span className="badge badge-danger">Vencida</span>
                      }
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(m.id)}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <MembershipModal onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
