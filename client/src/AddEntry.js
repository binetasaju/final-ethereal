import React, { useState } from 'react';

const AddEntry = () => {
  // State to manage the text entry
  const [entry, setEntry] = useState('');

  // Handle the change in the textarea
  const handleChange = (e) => {
    setEntry(e.target.value);
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the data to send to the backend
    const data = { entry };

    try {
      // Make a POST request to the backend
      const response = await fetch('http://localhost:3434/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Entry saved successfully!');
        setEntry(''); // Clear the textarea after successful submission
      } else {
        alert('Error saving entry');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    }
  };

  return (
    <div>
      <h2>Create New Entry</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your thoughts here..."
          value={entry}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddEntry;
