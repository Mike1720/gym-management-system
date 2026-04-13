import { useState, useEffect } from 'react';
import { clientService } from '../../services/clientService';

const TYPES = [
  { value: 'MENSUAL',    label: 'Mensual (1 mes)' },
  { value: 'TRIMESTRAL', label: 'Trimestral (3 meses)' },
  { value: 'SEMESTRAL',  label: 'Semestral (6 meses)' },
  { value: 'ANUAL',      label: 'Anual (12 meses)' },
];

const EMPTY_FORM = {
  clientId: '',
  startDate: new Date().toISOString().split('T')[0],
  type: 'MENSUAL',
  amount: '',
};

export default function MembershipModal({ onSave, onClose, preselectedClientId }) {
  const [form, setForm]       = useState({ ...EMPTY_FORM, clientId: preselectedClientId || '' });
  const [clients, setClients] = useState([]);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clientService.getAll().then(res => setClients(res.data));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientId) { setError('Selecciona un cliente'); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError('El monto debe ser mayor a 0'); return; }
    setLoading(true);
    try {
      await onSave({
        clientId: Number(form.clientId),
        startDate: form.startDate,
        type: form.type,
        amount: Number(form.amount),
      });
    } catch (err) {
      setError(err.response?.data || 'Error al registrar la membresía');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Registrar membresía</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label>Cliente *</label>
              <select
                className="form-control"
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
                disabled={!!preselectedClientId}
              >
                <option value="">Seleccionar cliente...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de membresía *</label>
                <select className="form-control" name="type" value={form.type} onChange={handleChange}>
                  {TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Fecha de inicio *</label>
                <input
                  className="form-control"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Monto pagado (MXN) *</label>
              <input
                className="form-control"
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Ej: 500.00"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar membresía'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
