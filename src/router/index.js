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

    if (SITE_TYPE !== "SWAP") {
        document.addEventListener('contextmenu', event => event.preventDefault());
    }

    useEffect(() => {
        const isConnected = window.localStorage.getItem("isConnected");
        console.log(isConnected);
        if (isConnected === 'YES') {
            const walletType = window.localStorage.getItem("walletType");
            console.log(walletType);
            if (walletType === 'METAMASK') {
                connectMetamask();
            } else if (walletType === 'KAIKAS') {
                connectKaikas();
            }
        } else {
            setConnectWallet("NO");
        }
        getAnvPrice();
        checkWalletClosed();
    }, []);

    useEffect(() => { // CHECK METAMASK CONNECTION
        if (didMount.current) {
            didMount.current = false
            return;
        }

        if (!active) {
            logout();
        }
        if (account) {
            let isMetamask = chainId !== 1001 && chainId !== 8217;
            loadWalletAttributes(account, isMetamask, chainId);
        }
    }, [active, account])

    async function checkWalletClosed() {
        setInterval(async () => {
            const isConnected = window.localStorage.getItem("isConnected");
            // console.log(isConnected);
            if (isConnected === 'YES') {
                const walletType = window.localStorage.getItem("walletType");
                // console.log(walletType);
                if (walletType === 'KAIKAS') {
                    const isUnlocked = await window.klaytn._kaikas.isUnlocked();
                    // console.log(isUnlocked);
                    if (!isUnlocked) {
                        await logout();
                    } else {


                    }

                }
            }
        }, 1000);
    }

    function loadWalletAttributes(account, isMetamask, chainId) {
        setConnectWallet('YES');
        let tempAccounts = [];
        tempAccounts.push(account);
        setAccounts(tempAccounts);
        setNetworkId(chainId);
        setWalletType(isMetamask ? "METAMASK" : "KAIKAS");
        window.localStorage.setItem('walletType', isMetamask ? 'METAMASK' : 'KAIKAS');
        window.localStorage.setItem('isConnected', 'YES');
    }

    async function connectMetamask() {

        if (isMetamaskWalletInstalled()) {
            try {
                await activate(injected);

                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                const account = accounts[0];
                loadWalletAttributes(account, true, window.ethereum.networkVersion);
            } catch (e) {
                console.log(e)
            }
        } else {
            // set
            alert("Please install metamask");
        }

    }

    async function connectKaikas() {
        if (isKaikasWalletInstalled()) {
            try {
                await activate(kaikasConnector);

                const accounts = await window.klaytn.enable();
                const account = accounts[0]

                console.log(window.klaytn.networkVersion)

                loadWalletAttributes(account, false, window.klaytn.networkVersion);
            } catch (e) {
                console.log(e)
            }
        } else {
            alert("Please install Kaikas");
        }
    }

    async function getAnvPrice() {
        const res = await GET(MAIN_URL + '/api/anv/price');
        setAnvPrice(res['data']['price']);
    }

    function isMetamaskWalletInstalled() {
        return window.ethereum !== undefined
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
                          handleMetamaskConnect={() => connectMetamask()}
                          handleKaikasConnect={() => connectKaikas()}
                          handleLogout={() => logout()}/>
                </Route>
            </Switch>
            <Footer/>
        </BrowserRouter>
    )
}

export default Index
