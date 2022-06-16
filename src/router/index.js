import React, {Suspense, useEffect, useRef, useState} from 'react'
import {BrowserRouter, Redirect, Route, Switch, useHistory} from 'react-router-dom'
import Header from "../containers/header/Header";
import Footer from "../containers/footer/Footer";
import Home from "../components/home/Home";
import {GET, MAIN_URL} from "../api/api";
import {useWeb3React} from "@web3-react/core";
import {injected, kaikasConnector} from "../utils/web3/connectors";
import {SITE_TYPE} from "../utils/web3/networks";

function Index() {

    const {account, active, activate, library, chainId, deactivate} = useWeb3React();
    const didMount = useRef(true);
    const [accounts, setAccounts] = useState([]);
    const [networkId, setNetworkId] = useState(1);
    const [isConnectedWallet, setConnectWallet] = useState(undefined);
    const [walletType, setWalletType] = useState(null);
    const [anvPrice, setAnvPrice] = useState(0);


    useEffect(() => {
        const isConnected = window.localStorage.getItem("isConnected");
        console.log(isConnected);
        if (isConnected === 'YES') {
            connectKaikas();
        } else {
            setConnectWallet("NO");
        }
        checkWalletClosed();
    }, []);

    useEffect(() => { // CHECK CONNECTION
        if (didMount.current) {
            didMount.current = false
            return;
        }

        if (!active) {
            logout();
        }
        if (account) {
            loadWalletAttributes(account, chainId);
        }
    }, [active, account])

    async function checkWalletClosed() {
        setInterval(async () => {
            const isConnected = window.localStorage.getItem("isConnected");
            // console.log(isConnected);
            if (isConnected === 'YES') {
                const isUnlocked = await window.klaytn._kaikas.isUnlocked();
                // console.log(isUnlocked);
                if (!isUnlocked) {
                    await logout();
                } else {

                }
            }
        }, 1000);
    }

    function loadWalletAttributes(account, chainId) {
        setConnectWallet('YES');
        let tempAccounts = [];
        tempAccounts.push(account);
        setAccounts(tempAccounts);
        setNetworkId(chainId);
        setWalletType("KAIKAS");
        window.localStorage.setItem('walletType', "KAIKAS");
        window.localStorage.setItem('isConnected', 'YES');
    }

    async function connectKaikas() {
        if (isKaikasWalletInstalled()) {
            try {
                await activate(kaikasConnector);

                const accounts = await window.klaytn.enable();
                const account = accounts[0]

                console.log(window.klaytn.networkVersion);

                loadWalletAttributes(account, window.klaytn.networkVersion);
            } catch (e) {
                console.log(e)
            }
        } else {
            alert("Please install Kaikas");
        }
    }


    function isKaikasWalletInstalled() {
        return window.klaytn !== undefined
    }

    async function logout() {
        setConnectWallet("NO");
        window.localStorage.setItem("isConnected", "NO");
        window.localStorage.setItem("walletType", null);
        setNetworkId(undefined);
        setAccounts([]);
        setWalletType(null);
        try {
            await deactivate();
        } catch (e) {
            console.log(e);
        }
    }

    return (

        <BrowserRouter>
            <Header accounts={accounts}/>
            <Switch>
                <Route exact path="/">
                    <Home accounts={accounts} walletType={walletType}
                          isConnected={isConnectedWallet} networkId={networkId}
                          handleKaikasConnect={() => connectKaikas()}
                          handleLogout={() => logout()}/>
                </Route>
            </Switch>
            <Footer/>
        </BrowserRouter>
    )
}

export default Index
