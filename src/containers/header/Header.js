import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from "react-router-dom";
import logo from "../../assets/images/icon/main_logo_beta.wh.svg";



function Header(props) {
    const [accounts, setAccounts] = useState(undefined);

    useEffect(() => {
        setAccounts(props.accounts);
    }, [props.accounts]);

    return (
        <>
            <div style={{ width:'100%', background: '#070721' }}>
                <img src={logo} style={{ width:'250px',margin:'1rem 3rem'}}/>
            </div>
        </>
    )
}

export default Header
