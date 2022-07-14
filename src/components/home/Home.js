import React, {useEffect, useState} from 'react';
import MyNftList from './my_nft_list/MyNftList'
import ConnectWallet from "../connect_wallet/ConnectWallet";
import bg_image from "../../assets/images/bg/main_banner.jpg";

export default function Home(props) {


    return (
        <>
            <img src={bg_image} style={{ width:'100%', position: 'absolute', zIndex: -1 }} />
            {props.accounts && props.accounts.length > 0 && props.isConnected === 'YES' ? (
                <>
                    <ConnectWallet accounts={props.accounts} apiToken={props.apiToken} walletType={props.walletType}
                                   isConnected={props.isConnected} networkId={props.networkId}
                                   handleKaikasConnect={() => props.handleKaikasConnect()}
                                   handleLogout={() => props.handleLogout()}/>

                </>
            ) : (
                <ConnectWallet accounts={props.accounts} apiToken={props.apiToken} walletType={props.walletType}
                               isConnected={props.isConnected} networkId={props.networkId}
                               handleKaikasConnect={() => props.handleKaikasConnect()}/>
            )
            }
            <MyNftList accounts={props.accounts} apiToken={props.apiToken} isConnected={props.isConnected} handleLogout={() => props.handleLogout()}/>
        </>
    );
}
