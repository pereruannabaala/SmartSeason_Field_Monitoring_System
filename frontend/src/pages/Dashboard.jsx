import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  .ss-wrap { font-family: 'Instrument Sans', sans-serif; background: #fdfbf7; min-height: 100vh; color: #3e3a31; }
  .ss-topbar { background: #2d3e24; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 64px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  .ss-logo { font-family: 'Lora', serif; color: #e2efd9; font-size: 1.4rem; font-weight: 600; display: flex; align-items: center; gap: 10px; }
  .ss-logo-icon { color: #a3c585; display: flex; align-items: center; }
  .ss-role-badge { font-size: 10px; background: #4a6741; color: #fff; padding: 2px 8px; border-radius: 4px; margin-left: 10px; letter-spacing: 0.05em; }
  .ss-nav a { font-size: 14px; color: #a3c585; text-decoration: none; margin-left: 1.5rem; transition: color 0.2s; }
  .ss-nav a:hover { color: #fff; }
  
  .ss-main { padding: 2.5rem 2rem; max-width: 1200px; margin: 0 auto; }
  .ss-heading { font-family: 'Lora', serif; font-size: 2.25rem; color: #2d3e24; margin: 0; }
  
  .ss-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 3rem; }
  .ss-card { background: #fff; border: 1px solid #e0dcd0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
  .ss-stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #7a7363; margin-bottom: 10px; }
  .ss-stat-value { font-family: 'Lora', serif; font-size: 2.5rem; color: #2d3e24; }
  
  .ss-table-container { background: #fff; border: 1px solid #e0dcd0; border-radius: 12px; overflow-x: auto; }
  .ss-table { width: 100%; border-collapse: collapse; min-width: 900px; }
  .ss-table th { background: #f8f6f0; padding: 1rem 1.5rem; text-align: left; font-size: 12px; color: #5c574a; border-bottom: 1px solid #e0dcd0; }
  .ss-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f0eee8; font-size: 14px; }
  
  .ss-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; display: inline-block; }
  .bg-active { background: #e8f5e9; color: #2e7d32; }
  .bg-at-risk { background: #fff3e0; color: #ef6c00; }
  .bg-completed { background: #e3f2fd; color: #1565c0; }
  
  .ss-btn-primary { background: #4a6741; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; font-family: inherit; }
  .ss-btn-delete { background: #fee2e2; color: #b91c1c; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: background 0.2s; }
  .ss-btn-delete:hover { background: #fecaca; }
  
  .ss-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .ss-modal { background: white; padding: 2rem; border-radius: 12px; width: 450px; max-width: 95%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
  .ss-form-group { margin-bottom: 1.2rem; }
  .ss-form-group label { display: block; font-size: 12px; margin-bottom: 6px; color: #7a7363; font-weight: 600; }
  .ss-input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #e0dcd0; font-family: inherit; box-sizing: border-box; }
  .ss-select-inline { padding: 4px 8px; border-radius: 6px; border: 1px solid #e0dcd0; font-size: 13px; background: #fdfbf7; }
  
  .note-preview { font-size: 12px; color: #7a7363; font-style: italic; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-left: 2px solid #e0dcd0; padding-left: 8px; }
`;

// Icon Component
const SproutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 20h10" /><path d="M10 20c5.5-2.5 8-6.4 8-10 0-4.4-3.6-8-8-8s-8 3.6-8 8c0 3.6 2.5 7.5 8 10Z" /><path d="M13 20c.5-3 1-6.5.5-10" />
  </svg>
);

const Dashboard = () => {
  const [fields, setFields] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newField, setNewField] = useState({ name: '', crop_type: '', planting_date: '', agent: '' });
  
  const { token, user, logout } = useContext(AuthContext);
  const isAdmin = user?.is_staff || user?.role === 'admin';

  const selectStyle = { padding: '6px 10px', borderRadius: '8px', border: '1px solid #e0dcd0', backgroundColor: '#f8f6f0', color: '#3e3a31', cursor: isAdmin ? 'default' : 'pointer' };
  const inputStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #e0dcd0', width: '100%', fontSize: '13px', backgroundColor: '#fff' };

  const fetchFields = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/fields/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFields(res.data);
    } catch (err) { console.error("Fetch fields error:", err); }
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAgents(res.data);
      } catch (err) { console.error("Fetch agents error:", err); }
    };

    if (token) {
      fetchFields();
      if (isAdmin) fetchAgents();
    }
  }, [token, isAdmin]);

  const handleCreateField = async (e) => {
    e.preventDefault();
    const payload = {
      ...newField,
      agent: newField.agent ? parseInt(newField.agent) : null,
      current_stage: 'PLANTED' 
    };

    try {
      await axios.post('http://localhost:8000/api/fields/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewField({ name: '', crop_type: '', planting_date: '', agent: '' });
      fetchFields();
    } catch (err) { 
      console.error("Creation failed:", err.response?.data);
      alert(`Error: ${JSON.stringify(err.response?.data)}`); 
    }
  };

  const handleUpdate = async (fieldId, newStage, newNotes) => {
    try {
      const res = await axios.patch(`http://localhost:8000/api/fields/${fieldId}/`, 
        { current_stage: newStage, notes: newNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFields(fields.map(f => f.id === fieldId ? res.data : f));
    } catch (err) { console.error("Update failed:", err); }
  };

  const handleAdminUpdate = async (fieldId, updatedData) => {
    if (updatedData.agent !== undefined) {
      updatedData.agent = updatedData.agent === "" ? null : parseInt(updatedData.agent);
    }
    try {
      const res = await axios.patch(`http://localhost:8000/api/fields/${fieldId}/`, 
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFields(fields.map(f => f.id === fieldId ? res.data : f));
    } catch (err) { console.error("Admin update failed:", err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this field?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/fields/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFields(fields.filter(f => f.id !== id));
    } catch (err) { alert("Delete failed."); }
  };

  const getStatusClass = (status) => {
    if (status === 'At Risk') return 'bg-at-risk';
    if (status === 'Completed') return 'bg-completed';
    return 'bg-active';
  };

  return (
    <div className="ss-wrap">
      <style>{styles}</style>
      <nav className="ss-topbar">
        <div className="ss-logo">
          <span className="ss-logo-icon">
            <SproutIcon />
          </span> 
          SmartSeason 
          <span className="ss-role-badge">{isAdmin ? 'ADMIN' : 'AGENT'}</span>
        </div>
        <div className="ss-nav">
          <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a>
        </div>
      </nav>

      <main className="ss-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="ss-heading">{isAdmin ? 'Global Field Overview' : 'My Assigned Fields'}</h1>
          {isAdmin && <button className="ss-btn-primary" onClick={() => setShowModal(true)}>+ New Field</button>}
        </div>

        <section className="ss-stats">
          <div className="ss-card" style={{ borderLeft: '6px solid #a3c585' }}>
            <div className="ss-stat-label">Total Fields</div>
            <div className="ss-stat-value">{fields.length}</div>
          </div>
          <div className="ss-card" style={{ borderLeft: '6px solid #d97706' }}>
            <div className="ss-stat-label">At Risk</div>
            <div className="ss-stat-value">{fields.filter(f => f.status === 'At Risk').length}</div>
          </div>
          <div className="ss-card" style={{ borderLeft: '6px solid #2d3e24' }}>
            <div className="ss-stat-label">Active Growth</div>
            <div className="ss-stat-value">{fields.filter(f => f.current_stage !== 'HARVESTED').length}</div>
          </div>
        </section>

        {showModal && (
          <div className="ss-modal-overlay">
            <div className="ss-modal">
              <h2 style={{ fontFamily: 'Lora', marginTop: 0 }}>Register New Field</h2>
              <form onSubmit={handleCreateField}>
                <div className="ss-form-group"><label>Field Name</label><input type="text" className="ss-input" required value={newField.name} onChange={e => setNewField({...newField, name: e.target.value})} /></div>
                <div className="ss-form-group"><label>Crop Type</label><input type="text" className="ss-input" required value={newField.crop_type} onChange={e => setNewField({...newField, crop_type: e.target.value})} /></div>
                <div className="ss-form-group"><label>Planting Date</label><input type="date" className="ss-input" required value={newField.planting_date} onChange={e => setNewField({...newField, planting_date: e.target.value})} /></div>
                <div className="ss-form-group"><label>Assign Agent</label>
                  <select className="ss-input" value={newField.agent} onChange={e => setNewField({...newField, agent: e.target.value})}>
                    <option value="">Select Agent (Optional)...</option>
                    {agents.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
                  <button type="submit" className="ss-btn-primary" style={{ flex: 1 }}>Save Field</button>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: '#eee', border: 'none', borderRadius: '8px' }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <section className="ss-table-container">
          <table className="ss-table">
            <thead>
              <tr>
                <th>Field Name</th>
                {isAdmin && <th>Assigned Agent</th>}
                <th>Crop Type</th>
                <th>Stage</th>
                <th>Status</th>
                <th>{isAdmin ? 'Actions / Notes' : 'Observation Notes'}</th>
              </tr>
            </thead>
            <tbody>
              {fields.length > 0 ? fields.map((field) => (
                <tr key={field.id}>
                  <td style={{ fontWeight: 600 }}>{field.name}</td>
                  
                  {isAdmin && (
                    <td>
                      <select 
                        className="ss-select-inline"
                        value={field.agent || ''} 
                        onChange={(e) => handleAdminUpdate(field.id, { agent: e.target.value })}
                      >
                        <option value="">Unassigned</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
                      </select>
                    </td>
                  )}

                  <td style={{ color: '#7a7363' }}>{field.crop_type}</td>
                  
                  <td>
                    <select 
                      value={field.current_stage} 
                      disabled={isAdmin} 
                      onChange={(e) => handleUpdate(field.id, e.target.value, field.notes)} 
                      style={selectStyle}
                    >
                      <option value="PLANTED">Planted</option>
                      <option value="GROWING">Growing</option>
                      <option value="READY">Ready</option>
                      <option value="HARVESTED">Harvested</option>
                    </select>
                  </td>

                  <td><span className={`ss-badge ${getStatusClass(field.status)}`}>{field.status || 'Active'}</span></td>
                  
                  <td>
                    {isAdmin ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="note-preview" title={field.notes || 'No notes'}>
                          {field.notes || 'No observations yet'}
                        </div>
                        <button className="ss-btn-delete" onClick={() => handleDelete(field.id)}>Delete</button>
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        placeholder="Type observation and press enter..." 
                        defaultValue={field.notes || ''} 
                        onBlur={(e) => {
                          if (e.target.value !== field.notes) {
                            handleUpdate(field.id, field.current_stage, e.target.value);
                          }
                        }} 
                        onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                        style={inputStyle} 
                      />
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '3rem', color: '#7a7363' }}>
                    No field data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;