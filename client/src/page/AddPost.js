import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    post: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const apiUrl = "http://localhost:8000";
      const response = await axios.post(apiUrl, formData);
      
      if (response.status === 201) {
        // Redirect to home page after successful submission
        navigate('/');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col xs='12' className="py-3">
          <h1 className="text-center">Add New Blog Post</h1>
        </Col>
        <Col xs='12'>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter post title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="post"
                value={formData.post}
                onChange={handleChange}
                required
                placeholder="Write your post content here"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Post'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddPost;