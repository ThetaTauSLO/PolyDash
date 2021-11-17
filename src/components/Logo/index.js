import React from "react";
import mainLogo from "./hkn.png"
import { Avatar } from '@mui/material';

const Logo = ({size}) => {
    const fontSize = size || '36px';
    return (
        <>
            <Avatar alt="Example Alt" src={mainLogo} />
        </>
    )
}

export default Logo;