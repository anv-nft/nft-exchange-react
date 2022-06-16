import React, {useEffect, useState,} from 'react'
import {Button, Dropdown, Form, Modal, Nav, Navbar, NavDropdown, OverlayTrigger} from 'react-bootstrap';
import KarakaisIcon from '../../assets/images/connect_wallet/karakais_icon.svg';
import styles from "./ConnectWallet.module.scss"

function ConnectWallet(props) {

    const [isKaikasInstalled, setKaikasInstalled] = useState(false);


    function handleKaikas() {

        if (isKaikasWalletInstalled()) {
            props.handleKaikasConnect()
        } else {
            setKaikasInstalled(true);
        }

    }

    function isKaikasWalletInstalled() {
        return window.klaytn !== undefined
    }

    function confirmLogout() {
        if (window.confirm('로그아웃 하시겠습니까 ?')) {
            props.handleLogout()
        }
    }

    return (
        <>
            <section className={styles.connect_wallet}>
                <div className={styles.text_box}>
                    <h1>
                        ANIVERSE<br/>
                        Ticket To Burn
                    </h1>
                    <p>
                        Stake Larva NFT and earn rewards for the Ecosystem<br/>
                        participants!<br/>
                        Stake Larva NFT and earn rewards for the Ecosystem<br/>
                        participants!<br/>
                        rewards at any time
                    </p>
                    <div className={styles.button_box}>
                        {props.accounts && props.accounts.length > 0 && props.isConnected === 'YES' ? (
                            <button onClick={() => confirmLogout()}
                                    className={styles.wallet_button}>{props.accounts}</button>
                        ) : (
                            <button onClick={() => handleKaikas()} className={styles.wallet_button}>Connect
                                Wallet</button>
                        )
                        }
                    </div>
                </div>
            </section>

            <Modal className="network_modal" centered size="xs" show={isKaikasInstalled}
                   onHide={() => setKaikasInstalled(false)}>
                <Modal.Body>
                    <div className="network_select_title">Please Install Kaikas.</div>
                    <div className="text-center mt-5">
                        <img src={KarakaisIcon} alt="image"/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="" onClick={() => setKaikasInstalled(false)}
                            className="swap_confirm modal_btn "
                            size="lg"
                            block>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default ConnectWallet
