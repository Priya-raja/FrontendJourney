import React, { useEffect, useState } from 'react';

const ToastDebug = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    console.log('Component mounted');
    addToast('Mount toast', 'success');
  }, []);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleClick = () => {
    console.log('Button clicked');
    addToast('Button toast', 'success');
    setTimeout(() => addToast('Error toast', 'error'), 500);
    setTimeout(() => addToast('Info toast', 'info'), 1000);
  };

  const getToastStyle = (type) => ({
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '4px',
    color: 'white',
    position: 'relative',
    cursor: 'pointer',
    backgroundColor: 
      type === 'success' ? '#28a745' :
      type === 'error' ? '#dc3545' :
      type === 'info' ? '#17a2b8' : '#6c757d'
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Toast Debug Test</h2>
      <button 
        onClick={handleClick}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test All Toasts
      </button>
      
      {/* Custom Toast Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px'
      }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={getToastStyle(toast.type)}
            onClick={() => removeToast(toast.id)}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastDebug;