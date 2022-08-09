import React, {Suspense, useEffect, useRef, useState} from 'react'
import {BrowserRouter, Redirect, Route, Switch, useHistory} from 'react-router-dom'
import Header from "../containers/header/Header";
import Footer from "../containers/footer/Footer";
import Home from "../components/home/Home";
import {GET, POST} from "../api/api";
import {useWeb3React} from "@web3-react/core";
import {injected, kaikasConnector} from "../utils/web3/connectors";
import Caver from "caver-js";
import {isTestNet} from "../utils/web3/networks";

function Index() {

    const {account, active, activate, library, chainId, deactivate} = useWeb3React();
    const didMount = useRef(true);
    const [accounts, setAccounts] = useState([]);
    const [apiToken, setApiToken] = useState(null);
    const [networkId, setNetworkId] = useState(1);
    const [isConnectedWallet, setConnectWallet] = useState(undefined);
    const [walletType, setWalletType] = useState(null);


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

    useEffect(async () => { // CHECK CONNECTION
        if (didMount.current) {
            didMount.current = false
            return;
        }
        if (!active) {
            await logout();
        }
        if (account) {
            loadWalletAttributes(account, chainId);
        }
    }, [active, account]);

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
                if(!isTestNet){
                    if(window.klaytn.networkVersion !== 8217){
                        alert('지갑을 메인넷으로 전환해주세요.');
                        throw 'error';
                    }
                }

                const token = localStorage.getItem('aniverse_token');
                if(token === null){
                    //토큰생성
                    const res = await GET(`/api/v1/auth/exchange/${account}/uuid`);
                    // sign
                    const message = res.uuid;
                    const provider = window['klaytn'];
                    const caver = new Caver(provider);
                    const signedMessage = await caver.klay.sign(message, account);
                    // get JWT
                    // jwt = await requestSignin(address, signedMessage);
                    const signin = await POST(`/api/v1/auth/exchange/signin`, {
                        address: account,
                        message: signedMessage
                    });
                    // save JWT
                    localStorage.setItem('aniverse_token',  signin.token);
                    setApiToken(signin.token);
                    loadWalletAttributes(account, window.klaytn.networkVersion);
                } else if(token){
                    const tokenCheck = await POST(`/api/v1/auth/tokencheck`,{address: account},token);
                    if(tokenCheck.result === 'success' && tokenCheck.address === account){
                        setApiToken(token);
                        loadWalletAttributes(account, window.klaytn.networkVersion);
                    }else {
                        await logout();
                    }
                } else {
                    await logout();
                }
            } catch (e) {
                await logout();
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
        console.log('logout');
        setConnectWallet("NO");
        window.localStorage.setItem("isConnected", "NO");
        window.localStorage.setItem("walletType", null);
        window.localStorage.removeItem("aniverse_token");
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
            <Header/>
            <Switch>
                <Route exact path="/">
                    <Home accounts={accounts} apiToken={apiToken} walletType={walletType}
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
