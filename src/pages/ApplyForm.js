import React, { useState } from 'react';
import axios from 'axios';
import './ApplyForm.css';

const ApplyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    cv: null,
  });

  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(''); // Add error state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setFormData({ ...formData, cv: file });
        setError('');
      } else {
        setError('File size must be less than 5MB.');
      }
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true during submission
    setError(''); // Clear any previous errors

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('position', formData.position);
    data.append('cv', formData.cv);

    try {
      const response = await axios.post('https://quickchef-server.onrender.com/api/apply', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Application submitted successfully!');
      console.log(response.data);

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        cv: null,
      });

      // Clear file input
      document.getElementById('cv').value = '';
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Error submitting application. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="apply-form-container">
      <h1>Job Application Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="position">Position Applied For</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cv">Upload CV (PDF only, max 5MB)</label>
          <input
            type="file"
            id="cv"
            name="cv"
            onChange={handleFileChange}
            accept=".pdf"
            required
            disabled={loading}
          />
          {error && <p className="error-message">{error}</p>}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyForm;
