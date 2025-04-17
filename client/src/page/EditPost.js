import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Spinner, Navbar } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../App.css';
const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    post: ''
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch the current post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const apiUrl = `http://localhost:8000/${id}`;
        const response = await axios.get(apiUrl);
        
        if (response.status === 200) {
          const post = response.data.record;
          setFormData({
            title: post.title,
            post: post.post
          });
          if (post.image_path) {
            setCurrentImage(`http://localhost:8000${post.image_path}`);
          }
        } else {
          // Handle non-200 responses that don't throw errors
          setError(`Failed to load post data. Server returned status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id]);

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
      const apiUrl = `http://localhost:8000/${id}`;
      const response = await axios.put(apiUrl, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        // Redirect to the post detail page after successful update
        navigate(`/blog/${id}`);
      } else {
        // Handle non-200 responses that don't throw errors
        setError(`Failed to update post. Server returned status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
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
        {isLoading ? (
          <Row className="justify-content-center">
            <Col xs="12" className="loading-spinner">
              <Spinner animation="border" role="status" variant="light">
                <span className="visually-hidden">Loading post data...</span>
              </Spinner>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs="12" lg={{ span: 8, offset: 2 }}>
              <h1>Edit Blog Post</h1>
              
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
                    placeholder="Enter post title"
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
                    Upload a new image or keep the current one.
                  </Form.Text>
                  
                  {currentImage && !imagePreview && (
                    <div className="image-preview">
                      <p className="text-secondary mb-2">Current image:</p>
                      <img 
                        src={currentImage} 
                        alt="Current" 
                        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }} 
                      />
                    </div>
                  )}
                  
                  {imagePreview && (
                    <div className="image-preview">
                      <p className="text-secondary mb-2">New image:</p>
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
                        Updating...
                      </>
                    ) : 'Update Post'}
                  </Button>
                  <Button 
                    variant="secondary"
                    size="lg" 
                    onClick={() => navigate(`/blog/${id}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default EditPost;