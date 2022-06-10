import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from "react-router-dom";



function Header(props) {
    const [accounts, setAccounts] = useState(undefined);

    useEffect(() => {
        setAccounts(props.accounts);
    }, [props.accounts]);

    return (
        <>

        </>
    )
}

export default Header
