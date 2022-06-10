import React, {useEffect, useState,} from 'react'
import {Button, Dropdown, Form, Modal, Nav, Navbar, NavDropdown, OverlayTrigger} from 'react-bootstrap';
import KarakaisIcon from '../../assets/images/connect_wallet/karakais_icon.svg';


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
        if(window.confirm('로그아웃 하시겠습니까 ?')){
            props.handleLogout()
        }
    }
    return (
        <>
            <section className="wallet_sec">
                {props.accounts && props.accounts.length > 0 && props.isConnected === 'YES' ? (
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <Button onClick={() => confirmLogout()} className="connect-wallet text-truncate ">{props.accounts}</Button>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-8 mx-auto text-center">
                            <Button onClick={() => handleKaikas()} className="connect-wallet text-truncate ">Connect Wallet</Button>
                        </div>
                    </div>
                )
                }
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
