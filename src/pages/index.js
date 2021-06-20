import React from "react"

import { Container, Row, Col } from 'reactstrap'
import Link from '../components/link'
import Button from '../components/btn'
import Layout from "../components/layout"
import SEO from "../components/seo"
import { FaGithub, FaBolt, FaHome, FaWrench, FaCalendarAlt } from 'react-icons/fa'
import Form from '../components/form'
import Slider from '../components/slider'
import Box from '../components/box'
import Hr from '../components/hr'
import Benefits from '../components/benefits'
import styled from 'styled-components'
import HomeFeatures from '../components/homeFeatures'

let StyledBackground = styled.div`
  background: linear-gradient(to bottom,#f9fbfd 0,#fff 100%);
`

let Service = ({title, Icon = FaHome}) => (
  <Col xs={12} md={4} className="mb-3">
    <Link to="/">
      <Box>
        <Icon size={30}/>
        <h4 className="mt-3">{title}</h4>
      </Box>
    </Link>
  </Col>
)

let Index = () => (
  <Layout>
    <SEO title="Home" />
    <Slider/>
    <Container className="pt-4">
      <h2 className="text-center mb-4">About HKN</h2>
      <div className="text-center">
        <p>IEEE-Eta Kappa Nu (HKN) is the student honor society under IEEE dedicated to encouraging and acknowledging excellence in the fields of Electrical Engineering, Computer Engineering and other IEEE fields of interest. The organization offers a variety of service programs and leadership training to help student members develop lifelong skills that differentiate them from others seeking prominent positions in industry and academia.</p>
        <p className="text-muted">The Epsilon Phi branch at Cal Poly aims to TBD</p>
      </div>
    </Container>
    <Container className="py-5">
      <h2 className="text-center mb-4">What we do</h2>
      <Row>
        <Service title="Events" Icon={FaCalendarAlt}/>
        <Service title="Workshops" Icon={FaBolt}/>
        <Service title="TBA" Icon={FaWrench}/>
      </Row>
    </Container>
    {/* <div className="text-center py-5">
      <Button to="https://github.com/EnumC/CalPolyHKN" className="btn btn-primary btn-lg">
        <FaGithub className="mr-1"/>
        View on Github
      </Button>
    </div> */}
    <StyledBackground>
      {/* <Benefits/> */}
      <div className="py-5">
        <Container>
          <Row className="d-flex justify-content-center">
            <Col md={8}>
              <Box style={{textAlign: 'left'}}>
                <h3 className="text-center">Sign up to be updated on future events!</h3>
                <Hr/>
                <Form/>
              </Box>
            </Col>
          </Row>
        </Container>
      </div>
    </StyledBackground>
    <HomeFeatures/>
  </Layout>
)

export default Index
