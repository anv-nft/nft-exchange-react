import React from 'react'

import logo from "../../assets/images/icon/main_logo_beta.wh.svg";

function Header() {
    return (
        <>
            <div style={{ width:'100%', background: '#070721' }}>
                <img src={logo} style={{ width:'250px',margin:'1rem 3rem'}}/>
            </div>
        </>
    )
}

export default Header
