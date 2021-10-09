import React from 'react'
import {Container, Row, Col} from 'reactstrap'
import { FaFacebookSquare, FaInstagram } from 'react-icons/fa';
import Link from './link';
import styled from "styled-components"
import footerItems from '../data/footer.json'

const FooterStyling = styled.footer`
  padding: 3rem 0;
  background: #f8f9fa;
  a, a:hover {
    color: inherit;
  }
  ul {
    color: rgba(0, 0, 0, 0.5);
    -webkit-padding-start: 0;
    padding: 0;
    & > li {
      list-style: none;
      a, a:hover {
        color: inherit;
      }
    }
  }
`

let SocialLink = ({href, Icon}) => (
  <Link to={href} className="mr-2">
    <Icon size={30}/>
  </Link>
)

let FooterLink = ({to, children}) => (
  <li>
    <Link to={to}>
      {children}
    </Link>
  </li>
)

let Footer = ({
  facebook_url = "https://www.facebook.com/Cal-Poly-HKN-342680813679270/",
  instagram_url = "https://www.instagram.com/calpolyhkn/"
}) => (
  <FooterStyling>
    <Container>
      <Row>
        {footerItems.map(item => (
          <Col xs={12} md={3}>
            <h5>{item.name}</h5>
            <ul>
              {item.dropdownItems.map(dropdownItem => (
                <FooterLink to={dropdownItem.url}>{dropdownItem.name}</FooterLink>
              ))}
            </ul>
          </Col>
        ))}
        <Col xs={12} md={3}>
          <h5>Follow Us On Social Media!</h5>
          <SocialLink Icon={FaFacebookSquare} href={facebook_url}/>
          <SocialLink Icon={FaInstagram} href={instagram_url}/>
        </Col>
      </Row>
    </Container>
  </FooterStyling>
)

export default Footer
