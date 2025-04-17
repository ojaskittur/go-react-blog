import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Spinner, Navbar } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
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
    <>
      <Navbar className="app-navbar">
        <Container>
          <Link to="/">
            <Navbar.Brand>Blog Explorer</Navbar.Brand>
          </Link>
        </Container>
      </Navbar>

      <Container>
        <Row>
          <Col xs="12" lg={{ span: 8, offset: 2 }}>
            <h1>Create New Post</h1>
            
            {error && <div className="alert alert-danger mb-4">{error}</div>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter an engaging title"
                  className="form-control-lg"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  name="post"
                  value={formData.post}
                  onChange={handleChange}
                  required
                  placeholder="Write your post content here"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Featured Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Text className="text-secondary">
                  Add a high-quality image to make your post stand out.
                </Form.Text>
                
                {imagePreview && (
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </Form.Group>

              <div className="d-flex gap-3 mb-5">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="px-4"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner 
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Publishing...
                    </>
                  ) : 'Publish Post'}
                </Button>
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Col>
        </Row>

        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Blog Explorer • Built with React & Go Fiber</p>
        </footer>
      </Container>
    </>
  );
};

export default AddPost;