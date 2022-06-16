import React from 'react'
import logo2 from "../../assets/images/icon/aniverse_logo.png";

function Footer() {
    return (
        <div className="footer">
            <div className="row">
                <img src={logo2} style={{width: '200px'}}/>
            </div>
            <div className="row">
                <a href="mailto:contact@aniverse.io">contact@aniverse.io</a>
            </div>
            <div className="row text-right">
                <p className="footer_text_001">COPYRIGHT © 2021 ANIVERSE All RIGHTS RESERVED. </p>
            </div>
        </div>
    )
}

export default Footer
