import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile page with orders tab active
    navigate('/profile', { state: { activeTab: 'orders' }, replace: true });
  }, [navigate]);

  return null;
};

export default Orders;
