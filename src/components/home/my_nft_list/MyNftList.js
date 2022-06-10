import React, {useEffect, useRef, useState} from 'react'
import { Modal, Button, Form} from 'react-bootstrap';
import {GET, MAIN_URL, POST} from "../../../api/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useHistory} from "react-router-dom";
import LoadingModal from "../../loading_modal/LoadingModal"
import styles from "./MyNftList.module.scss"
import Caver from "caver-js";
import DaumPostcode from "react-daum-postcode";

function MyNftList(props) {

    const nftListRef = useRef([]);
    const [nftList, setNftList] = useState([])
    const [showLoading, setShowLoading] = useState(false);

    const [accounts, setAccounts] = useState([]);


    const [nftTokenId, setNftTokenId] = useState([]);
    // const [postPopup, setPostPopup] = useState(false);

    const [modalShow, setModalShow] = useState(false);
    const modalClose = () => setModalShow(false);
    const modalOpen = () => setModalShow(true);
    const [postModalShow, setPostModalShow] = useState(false);
    const postModalClose = () => setPostModalShow(false);
    const postModalOpen = () => setPostModalShow(true);
    const [homeAddress, setHomeAddress] = useState([]);


    let history = useHistory();

    useEffect(() => {
        getMyNftList();
        console.log(props);
        setAccounts(props.accounts);
    }, [props.accounts]);


    async function getMyNftList() {
        const res = await GET(`/api/v1/exchange/nft?address=${props.accounts}`);
        let listOfNft = [];

        for (let i = 0; i < res.data.length; i++) {
            const item = res.data[i];

            listOfNft.push(item);
        }
        nftListRef.current = listOfNft;
        setNftList(nftListRef.current);
    }

    function modalFadeIn(tokenId) {
        setNftTokenId([tokenId])
        modalOpen();
    }

    function nftTransfer(nftToken) {
        // Argument : KIP17 Contract Address -> 해당 주소는 테스트로 Deploy 한 Contract Address
        // (https://baobab.scope.klaytn.com/account/0xf550014532471511435af9b2b2dadd0189ce0f92?tabId=txList)
        // const provider = window['klaytn'];
        // const caver = new Caver(provider);
        // const kip17instance = new caver.klay.KIP17("0xf550014532471511435af9b2b2dadd0189ce0f92");
        // const EXCHANGE_ADDRESS = "0x0d1B527D41225C021b26B6832bBe3fcAEfF7f078"; // 받는지갑주소
        // const sender = props.accounts[0];
        // console.log(sender)
        // // Argument : Sender, Receiver, TokenID, from
        // kip17instance.transferFrom(sender, EXCHANGE_ADDRESS, 1, {from: sender})
        //     .then(async result => {
        //         console.log(result);
        //     })
    }
    const handlePostCode = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        setHomeAddress([data.zonecode,fullAddress]);
        postModalClose();
    }

    const postCodeStyle = {
        display: "block",
        height: "500px",
        background: "#eee"
    };
    return (
        <>
            <section className={styles.MyNftList}>
                <div className={styles.container}>
                    {
                        <div className={styles.box}>
                            {nftList.map((item, index) => (
                                <div className={styles.img_box}>
                                    <a onClick={() => {
                                        modalFadeIn(item.tokenId)
                                    }} className="">
                                        {(() => {
                                            switch (item.use) {
                                                case "Y":
                                                    return <><video src={item.image}/><br/></>;
                                                case "N":
                                                    return <div><span>처리완료</span><br/><video className={styles.disable} src={item.image}/><br/></div>;
                                            }
                                        })()}
                                        {item.tokenId}
                                    </a>

                                </div>
                            ))
                            }
                        </div>
                    }
                    {
                        nftList.length === 0 &&
                        <div className="no_data_found">
                            <div className="no_data_found_text">
                                No Item
                            </div>
                        </div>
                    }
                </div>
                <LoadingModal showLoading={showLoading} setShowLoading={setShowLoading}/>

            </section>
            <Modal show={modalShow} onHide={modalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>NFT 실물교환</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span style={{color: "red"}}>* 신청이 완료되면 보유한 NFT는 소각 처리됩니다.</span><br/>
                    <span style={{color: "red"}}>* TokenID : {nftTokenId}</span><br/>
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>이름</Form.Label>
                            <Form.Control type="text" placeholder="ex) 홍길동"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPhoneNumber">
                            <Form.Label>연락처</Form.Label>
                            <Form.Control type="text" placeholder="ex) 010-1234-5678"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>주소</Form.Label>
                            <a className="btn btn-info ml-3 mb-1" onClick={postModalOpen}>주소 찾기</a>
                            <Form.Control type="text" value={homeAddress[0]} placeholder="우편번호" readOnly/>
                            <Form.Control type="text" value={homeAddress[1]} placeholder="주소" readOnly/>
                            <Form.Control type="text" placeholder="상세주소" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={nftTransfer(nftTokenId)}>
                        신청완료
                    </Button>
                    <Button variant="secondary" onClick={modalClose}>
                        취소
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size="lg" show={postModalShow} onHide={postModalClose}>
                <DaumPostcode style={postCodeStyle} onComplete={handlePostCode} />
                <Modal.Footer>
                    <Button variant="secondary" onClick={postModalClose}>
                        취소
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default MyNftList
