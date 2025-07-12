import { useContext } from 'react';
import { AlertContext } from '../../context/AlertContext';

const Alert = () => {
  const { alert } = useContext(AlertContext);

  if (!alert) return null;

  return (
    <div className={`alert alert-${alert.type} alert-mobile`}>
      <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : alert.type === 'danger' ? 'exclamation-circle' : 'info-circle'}`}></i>
      {alert.msg}
    </div>
  );
};

export default Alert;