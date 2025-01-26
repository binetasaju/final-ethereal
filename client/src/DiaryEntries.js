import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DiaryEntries = () => {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = () => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Ensure token exists
    if (!token) {
      setErrorMessage('You are not authorized. Please log in.');
      return;
    }

    axios
      .get('http://localhost:3434/entries', {
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers
      })
      .then((response) => {
        setEntries(response.data);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Failed to fetch entries.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Ensure token exists
    if (!token) {
      setErrorMessage('You are not authorized. Please log in.');
      return;
    }

    axios
      .post(
        'http://localhost:3434/entries',
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include token in headers
        }
      )
      .then((response) => {
        // Update the entries by using the function form of setState to ensure you get the latest state
        setEntries((prevEntries) => [...prevEntries, response.data.entry]);
        setTitle('');
        setContent('');
        setErrorMessage(''); // Clear any error messages
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Failed to add entry.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Form Section (Left Side) */}
      <div
        style={{
          flex: '1',
          marginRight: '20px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px', // Set minimum height to keep the boxes consistent
        }}
      >
        <h1>Diary Entry</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '18px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{
              width: '100%',
              height: '200px',
              padding: '15px',
              fontSize: '18px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '15px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              width: '100%',
            }}
          >
            Add Entry
          </button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>

      {/* Existing Entries Section (Right Side) */}
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px', // Set minimum height to keep the boxes consistent
        }}
      >
        <h1>Existing Entries</h1>
        {entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              backgroundColor: '#f9f9f9',
              padding: '20px',
              marginBottom: '20px',
              textAlign:'left',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2>{entry.title}</h2>
            <p>{entry.content}</p>
            <small>{entry.created_at}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiaryEntries;
