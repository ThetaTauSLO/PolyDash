import React from "react";
import mainLogo from "./thetatau.jpg";
import { Avatar, Typography } from '@mui/material';

const Logo = ({size, text}) => {
    const fontSize = size || '36px';
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
        }}>
            <Avatar alt="Theta Tau SLO Epsilon Phi Logo" src={mainLogo} sx={{ width: {fontSize}, height: {fontSize} }}/>
            {(text) ? <Typography variant="h6" sx={{ ml: 2 }}>{text}</Typography> : ""}
            
        </div>
    )
}

export default Logo;