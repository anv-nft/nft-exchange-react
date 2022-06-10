import React, {useEffect, useState} from 'react';
import MyNftList from './my_nft_list/MyNftList'
import ConnectWallet from "../connect_wallet/ConnectWallet";
import bg_image from "../../assets/images/bg/bg_001.png";
export default function Home(props) {


    return (
        <>
            <img src={bg_image} style={{ width:'100%' }} />
            {props.accounts && props.accounts.length > 0 && props.isConnected === 'YES' ? (
                <>
                    <ConnectWallet accounts={props.accounts} walletType={props.walletType}
                                   isConnected={props.isConnected} networkId={props.networkId}
                                   handleMetamaskConnect={() => props.handleMetamaskConnect()}
                                   handleKaikasConnect={() => props.handleKaikasConnect()}
                                   handleLogout={() => props.handleLogout()}/>
                    <MyNftList accounts={props.accounts}/>
                </>
            ) : (
                <ConnectWallet accounts={props.accounts} walletType={props.walletType}
                               isConnected={props.isConnected} networkId={props.networkId}
                               handleMetamaskConnect={() => props.handleMetamaskConnect()}
                               handleKaikasConnect={() => props.handleKaikasConnect()}/>
            )
            }
        </>
    );
}
