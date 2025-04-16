import React,{ useEffect} from 'react';
import axios from 'axios';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Col,Row,Container } from 'react-bootstrap';

const Blog = () => {
    const params = useParams();
    const [apiData, setApiData] = useState(false)
    

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const apiUrl = `http://localhost:8000/${params.id}`;
                    const response = await axios.get(apiUrl);

                    if (response.status === 200) {
                        setApiData(response?.data?.record);
                    }
                } catch (error) {
                    console.log(error.response);
                }
            };
            fetchData();
            return () => { };
        }, [params.id]);
        console.log(apiData)
        return (
            <Container>
                <Row>
                    <Col xs='12'>
                        <h1>{apiData.title}</h1>
                    </Col>
                    <Col xs='12'>
                        <p>{apiData.post}</p>
                    </Col>
                </Row>
            </Container>
        );
};

export default Blog