import * as React from "react";
import PropTypes from "prop-types";
import "../assets/stylesheets/layout.scss"
import * as Icons from 'react-icons/fa'
import Button from '../components/btn'

const DynamicFaIcon = ({ name }) => {
    const IconComponent = Icons[name];

    if (!IconComponent) { // Return a default one
        return <Icons.FaExclamationTriangle />;
    }

    return <IconComponent />;
};

function TeamMember(props) {
    const icons = {
        email: "FaEnvelope",
        website: "FaInternetExplorer"
    }
    const member = props.member;
    return (
        <div className="team-container">
            <img className="team-photo" src={member.photo} alt={member.name} />
            <div className="team-content">
                <div className="team-header">
                    <div className="team-name">{member.name}</div>
                    <div className="text">{member.position}</div>
                    {Object.keys(member.links).map((key) => (
                        <a className="memberIcon" href={member.links[key]} onClick={(e) => { e.preventDefault(); console.log(member.links); window.open(member.links[key], "_blank").focus() }}>
                            <DynamicFaIcon name={icons[key]} className="mr-1" />
                        </a>
                    ))};
                </div>
                <p className="text">
                    {member.bio}
                </p>
            </div>
        </div>
    );
}

// See data/team.js for more information.
TeamMember.propTypes = {
    member: PropTypes.object
};

export default TeamMember;