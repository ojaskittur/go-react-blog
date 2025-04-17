import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    post: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Use FormData to handle multipart/form-data for file uploads
    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('post', formData.post);
    
    if (image) {
      postData.append('image', image);
    }

    try {
      const apiUrl = "http://localhost:8000";
      const response = await axios.post(apiUrl, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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

            <Form.Group className="mb-3">
              <Form.Label>Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                  />
                </div>
              )}
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