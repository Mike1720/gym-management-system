import { useState, useEffect } from 'react';

const EMPTY_FORM = { name: '', lastName: '', email: '', phone: '' };

export default function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name || '',
        lastName: client.lastName || '',
        email: client.email || '',
        phone: client.phone || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [client]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.lastName.trim()) {
      setError('El nombre y apellido son obligatorios');
      return;
    }
    setLoading(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.response?.data || 'Error al guardar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{client ? 'Editar cliente' : 'Nuevo cliente'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej: Juan"
                />
              </div>
              <div className="form-group">
                <label>Apellido *</label>
                <input
                  className="form-control"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Ej: Pérez"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                className="form-control"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Ej: 5551234567"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : (client ? 'Actualizar' : 'Crear cliente')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
