import React from 'react'
import PageTemplate from '../components/pageTemplate'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
// import { faMail} from '@fortawesome/free-solid-svg-icons'

import TeamInfo from "../data/team";
import TeamMember from "../components/teamMember";

const TeamPage = () => {
    return(
    <PageTemplate title="Meet the team">

            <div className="container">
                <div class="header">About Us</div>
                <p className="text">

                </p>
                <div class="header">Team</div>
                {TeamInfo.map((member) =>
                    <TeamMember member={member} />
                )};
            </div>
        </PageTemplate>)
};

export default TeamPage;