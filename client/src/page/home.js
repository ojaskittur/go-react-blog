import axios from 'axios';
import { useEffect, useState } from "react";
import { Col, Container, Row, Button, Card, Navbar, Spinner } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
const Home = () => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null });
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const apiUrl = "http://localhost:8000";
      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setApiData(response?.data.blog_records || []);
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      setDeleteStatus({ loading: true, error: null });
      try {
        const apiUrl = `http://localhost:8000/${id}`;
        const response = await axios.delete(apiUrl);
        if (response.status === 200) {
          // Refresh the data after successful deletion
          fetchData();
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        setDeleteStatus({
          loading: false,
          error: "Failed to delete post. Please try again."
        });
      } finally {
        setDeleteStatus({ loading: false, error: null });
      }
    }
  };

  const truncateText = (text, maxLength = 120) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      <Navbar className="app-navbar">
        <Container>
          <Navbar.Brand>Blog Explorer</Navbar.Brand>
          <Link to="/add-post">
            <Button variant="primary">Create New Post</Button>
          </Link>
        </Container>
      </Navbar>

      <Container>
        <Row>
          <Col xs="12" className="pb-3">
            <h1>Discover Latest Posts</h1>
          </Col>

          {deleteStatus.error && (
            <Col xs="12">
              <div className="alert alert-danger">{deleteStatus.error}</div>
            </Col>
          )}

          {isLoading ? (
            <Col xs="12" className="loading-spinner">
              <Spinner animation="border" role="status" variant="light">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Col>
          ) : apiData.length === 0 ? (
            <Col xs="12" className="text-center py-5">
              <h3>No posts found</h3>
              <p className="text-secondary">Be the first to create a blog post!</p>
              <Link to="/add-post">
                <Button variant="primary" className="mt-3">Add New Post</Button>
              </Link>
            </Col>
          ) : (
            apiData.map((record, index) => (
              <Col key={index} xs="12" md="6" lg="4" className="mb-4">
                <Card 
                  className="h-100" 
                  onClick={() => navigate(`blog/${record.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  {record.image_path ? (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8000${record.image_path}`}
                      alt={record.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="card-img-placeholder" style={{ 
                      height: '120px', 
                      background: 'linear-gradient(135deg, #303030 0%, #424242 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666'
                    }}>
                      <i className="bi bi-file-text" style={{ fontSize: '2rem' }}></i>
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title>{record.title}</Card.Title>
                    <Card.Text className="text-secondary">
                      {truncateText(record.post)}
                    </Card.Text>
                    <div className="d-flex justify-content-between mt-auto pt-3">
                      <Button 
                        variant="info" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`blog/${record.id}`);
                        }}
                      >
                        Read More
                      </Button>
                      <div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-post/${record.id}`);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => handleDelete(record.id, e)}
                          disabled={deleteStatus.loading}
                        >
                          {deleteStatus.loading ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Blog Explorer • Built with React & Go Fiber</p>
        </footer>
      </Container>
    </>
  );
};

export default Home;