import React, { useEffect, useState } from 'react';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000';
    fetch(`${backendUrl}/api/products`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (data.products) {
          setProducts(data.products);
        } else {
          setMessage('No products found or not authorized');
        }
      })
      .catch(() => setMessage('Error fetching products'));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard - Products</h2>
      {message && <p>{message}</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <h3>{p.title}</h3>
            <p>Price: {p.price}</p>
            {p.image && <img src={p.image} alt={p.title} width="100" />}
            <p>{p.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
