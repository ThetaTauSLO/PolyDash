import React from "react";
import mainLogo from "./hkn.png"
import { Avatar } from '@mui/material';

const Logo = ({size}) => {
    const fontSize = size || '36px';
    return (
        <>
            <Avatar alt="IEEE-HKN Epsilon Phi Logo" src={mainLogo} sx={{ width: {fontSize}, height: {fontSize} }}/>
        </>
    )
}

export default Logo;