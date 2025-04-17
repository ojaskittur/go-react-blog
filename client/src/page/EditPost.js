import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

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
      }
    } catch (error) {
      console.error('Error updating post:', error);
      setError('Failed to update post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Row>
          <Col xs='12' className="py-3 text-center">
            Loading post data...
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col xs='12' className="py-3">
          <h1 className="text-center">Edit Blog Post</h1>
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
              <Form.Label>Image</Form.Label>
              {currentImage && !imagePreview && (
                <div className="mb-2">
                  <p>Current image:</p>
                  <img 
                    src={currentImage} 
                    alt="Current" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <p>New image:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Post'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate(`/blog/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditPost;