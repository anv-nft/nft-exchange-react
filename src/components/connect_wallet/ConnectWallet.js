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
                        ANIVERSE GIFT NFT <br/>
                        Sales Event
                    </h1>
                    <p>
                        Thank you for participating in the Aniverse ecosystem.<br/>
                        <br/>
                        Use the tokens obtained as rewards for purchasing NFTs linked to real-life products in the Aniverse ecosystem, and exchange them for awesome prizes at a discounted price!<br/>
                        <br/>
                        Don't miss the chance to get the products you want while the offer lasts!<br/>
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
