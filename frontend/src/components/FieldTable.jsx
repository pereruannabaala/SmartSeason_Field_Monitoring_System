import React from 'react';

const FieldTable = ({ data }) => {
  // If data hasn't loaded yet or is empty
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        No fields found. Add some in the Django Admin!
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Field Name</th>
            <th style={styles.th}>Crop</th>
            <th style={styles.th}>Stage</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((field) => (
            <tr key={field.id} style={styles.row}>
              <td style={styles.td}>{field.name}</td>
              <td style={styles.td}>{field.crop_type}</td>
              <td style={styles.td}>
                <span style={styles.badge}>{field.current_stage}</span>
              </td>
              <td style={styles.td}>
                <b style={{ color: getStatusColor(field.status) }}>
                  {field.status}
                </b>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to color-code the "At Risk" vs "Active" text
const getStatusColor = (status) => {
  switch (status) {
    case 'At Risk': return '#d32f2f'; // Red
    case 'Active': return '#2e7d32'; // Green
    case 'Completed': return '#1976d2'; // Blue
    default: return '#333';
  }
};

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
  headerRow: { backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' },
  th: { padding: '12px', textAlign: 'left', fontWeight: 'bold', color: '#495057' },
  td: { padding: '12px', borderBottom: '1px solid #eee' },
  row: { transition: 'background-color 0.2s' },
  badge: { 
    fontSize: '0.8rem', 
    padding: '4px 8px', 
    borderRadius: '4px', 
    backgroundColor: '#e9ecef',
    textTransform: 'capitalize'
  }
};

export default FieldTable;