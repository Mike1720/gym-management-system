import { useState, useEffect, useCallback } from 'react';
import { clientService } from '../services/clientService';
import ClientModal from '../components/clients/ClientModal';

const statusBadge = (status) => {
  const map = {
    'ACTIVA':        <span className="badge badge-success">Activa</span>,
    'VENCIDA':       <span className="badge badge-danger">Vencida</span>,
    'SIN MEMBRESÍA': <span className="badge badge-secondary">Sin membresía</span>,
  };
  return map[status] || <span className="badge badge-secondary">{status}</span>;
};

export default function ClientsPage() {
  const [clients, setClients]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [feedback, setFeedback]   = useState('');

  const loadClients = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const res = await clientService.getAll(q);
      setClients(res.data);
    } catch {
      setFeedback('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadClients(); }, [loadClients]);

  /* debounce search */
  useEffect(() => {
    const t = setTimeout(() => loadClients(search), 350);
    return () => clearTimeout(t);
  }, [search, loadClients]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit   = (c)  => { setEditing(c);   setModalOpen(true); };
  const closeModal = ()   => { setModalOpen(false); setEditing(null); };

  const handleSave = async (form) => {
    if (editing) {
      await clientService.update(editing.id, form);
      setFeedback('Cliente actualizado correctamente');
    } else {
      await clientService.create(form);
      setFeedback('Cliente creado correctamente');
    }
    closeModal();
    loadClients(search);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) return;
    try {
      await clientService.delete(id);
      setFeedback('Cliente eliminado');
      loadClients(search);
      setTimeout(() => setFeedback(''), 3000);
    } catch {
      setFeedback('Error al eliminar el cliente');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Clientes</h1>
          <p>Gestión de clientes del gimnasio</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nuevo cliente</button>
      </div>

      {feedback && (
        <div className={`alert ${feedback.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {feedback}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Lista de clientes ({clients.length})</h2>
          <div className="search-bar">
            <input
              className="search-input"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : clients.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 40 }}>👥</div>
              <p>{search ? 'No se encontraron clientes con esa búsqueda.' : 'No hay clientes registrados aún.'}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Membresía</th>
                  <th>Registrado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name} {c.lastName}</td>
                    <td>{c.email || '—'}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{statusBadge(c.membershipStatus)}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString('es-MX')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>
                          ✏️ Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <ClientModal client={editing} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  );
}
