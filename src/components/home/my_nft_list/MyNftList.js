import React, {useEffect, useRef, useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap';
import {GET, MAIN_URL, POST} from "../../../api/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useHistory} from "react-router-dom";
import LoadingModal from "../../loading_modal/LoadingModal"
import styles from "./MyNftList.module.scss"
import Caver from "caver-js";
import DaumPostcode from "react-daum-postcode";
import connectIcon from "../../../assets/images/icon/connect.png"
import popIcon from "../../../assets/images/icon/pop_icon.svg"

function MyNftList(props) {
    const [accounts, setAccounts] = useState([]);

    const nftListRef = useRef([]);
    const [nftList, setNftList] = useState([])

    const [showLoading, setShowLoading] = useState(false); // 로딩 모달



    const [nftTokenId, setNftTokenId] = useState(); //선택 토큰



    const [modalShow, setModalShow] = useState(false);
    const modalClose = () => setModalShow(false);
    const modalOpen = () => setModalShow(true);
    const [postModalShow, setPostModalShow] = useState(false);
    const postModalClose = () => setPostModalShow(false);
    const postModalOpen = () => setPostModalShow(true);

    const agreeBox = useRef();
    const formName = useRef();
    const formPhoneNumber1 = useRef();
    const formPhoneNumber2 = useRef();
    const formPhoneNumber3 = useRef();
    const formPostZip = useRef();
    const formPostAddress = useRef();
    const formPostAddress2 = useRef();
    const [agreeState, setAgreeState] = useState(false); // 동의 여부
    // const [formPhoneNumber, setFormPhoneNumber] = useState([]); // 연락처
    const [homeAddress, setHomeAddress] = useState([]);
    let history = useHistory();

    useEffect(() => {
        getMyNftList();
    }, [props.accounts]);

    useEffect(() => {
        setHomeAddress([]);
        setAgreeState(false);
    }, [nftTokenId]);

    async function getMyNftList() {
        // const res = await GET(`/api/v1/exchange/nft?address=${props.accounts}`);
        const res = await GET(`/api/v1/exchange/nftTest`);
        let listOfNft = [];

        for (let i = 0; i < res.data.length; i++) {
            const item = res.data[i];

            listOfNft.push(item);
        }
        nftListRef.current = listOfNft;
        setNftList(nftListRef.current);
    }

    function modalFadeIn(tokenId) {
        setNftTokenId(tokenId)
        modalOpen();
    }
    async function nftTransfer(nftToken) {
        // if(!agreeState){
        //     alert("개인정보 수집 약관에 동의 해주세요.");
        //     console.log(agreeBox.current);
        //     return agreeBox.current.focus();
        // }
        // const regName = /^[가-힣]{2,4}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;
        // if(formName.current.value == ""){
        //     alert("성명을 입력해주세요.");
        //     return formName.current.focus();
        // }
        // if(regName.test(formName.current.value) === false){
        //     alert("성명은 한글 또는 영문 한가지만 사용 가능합니다.");
        //     return formName.current.focus();
        // }
        //
        // if(formPhoneNumber1.current.value == ""){
        //     alert("연락처 앞자리를 선택해주세요.");
        //     return formPhoneNumber1.current.focus();
        // }
        // if(formPhoneNumber2.current.value == ""){
        //     alert("연락처를 입력해주세요.");
        //     return formPhoneNumber2.current.focus();
        // }
        // const regPhone2 = /([0-9]{3,4})$/;
        // if(regPhone2.test(formPhoneNumber2.current.value) === false){
        //     alert("숫자 3~4자리를 입력해주세요.");
        //     return formPhoneNumber2.current.focus();
        // }
        // if(formPhoneNumber3.current.value == ""){
        //     alert("연락처를 입력해주세요.");
        //     return formPhoneNumber3.current.focus();
        // }
        // const regPhone3 = /([0-9]{4})$/;
        // if(regPhone3.test(formPhoneNumber3.current.value) === false){
        //     alert("숫자 4자리를 입력해주세요.");
        //     return formPhoneNumber3.current.focus();
        // }
        // if(formPostZip.current.value == "" || formPostAddress.current.value == ""){
        //     alert("주소를 입력해주세요.");
        //     return formPostZip.current.focus();
        // }
        // if(formPostAddress2.current.value == ""){
        //     alert("상세주소를 입력해주세요.");
        //     return formPostAddress2.current.focus();
        // }

        // Argument : KIP17 Contract Address -> 해당 주소는 테스트로 Deploy 한 Contract Address
        // (https://baobab.scope.klaytn.com/account/0xf550014532471511435af9b2b2dadd0189ce0f92?tabId=txList)
        const provider = window['klaytn'];
        const caver = new Caver(provider);
        const kip17instance = new caver.klay.KIP17("0xf550014532471511435af9b2b2dadd0189ce0f92");
        const sender = props.accounts[0];
        const tokenNumber = parseInt(nftToken, 16);
        alert('소각 완료');
        return false;
        await kip17instance.burn(tokenNumber,  {from: sender}).then(async result => {
            //const testdata = {
            //     "blockHash": "0xeebe8161ca2ffcd86d37babf5c062a3a0d8a67a25478a18b45324743bb2dcc42",
            //     "blockNumber": 93535893,
            //     "contractAddress": null,
            //     "from": "0x0d1b527d41225c021b26b6832bbe3fcaeff7f078",
            //     "gas": "0x2e711",
            //     "gasPrice": "0x3a35294400",
            //     "gasUsed": 55949,
            //     "input": "0x42966c680000000000000000000000000000000000000000000000000000000000000010",
            //     "logsBloom": "0x00000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000010000000000000010008000000800000000000000000000000000000000000000000020000000000000000000800000000000000000000000010040000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000020002000000000000000000000000000000000000002000000000000000000000000",
            //     "nonce": "0x1",
            //     "senderTxHash": "0x1daa5b552e16bd2a0c10138efed78acd76da5abdb58f8493d8e68446146b3464",
            //     "signatures": [
            //     {
            //         "V": "0x7f5",
            //         "R": "0xd74b392f8a2cc74da7a77c9c7928dde503b705b7ed63c04b90ff4886cf499caf",
            //         "S": "0x6db1630594069a298f62a619b76d72161eedd3960b408fa971535d809cc6d740"
            //     }
            // ],
            //     "status": true,
            //     "to": "0xf550014532471511435af9b2b2dadd0189ce0f92",
            //     "transactionHash": "0x1daa5b552e16bd2a0c10138efed78acd76da5abdb58f8493d8e68446146b3464",
            //     "transactionIndex": 0,
            //     "type": "TxTypeLegacyTransaction",
            //     "typeInt": 0,
            //     "value": "0x0",
            //     "events": {
            //     "Transfer": {
            //         "address": "0xf550014532471511435aF9b2B2daDd0189ce0f92",
            //             "blockNumber": 93535893,
            //             "transactionHash": "0x1daa5b552e16bd2a0c10138efed78acd76da5abdb58f8493d8e68446146b3464",
            //             "transactionIndex": 0,
            //             "blockHash": "0xeebe8161ca2ffcd86d37babf5c062a3a0d8a67a25478a18b45324743bb2dcc42",
            //             "logIndex": 0,
            //             "id": "log_11f0a185",
            //             "returnValues": {
            //             "0": "0x0d1B527D41225C021b26B6832bBe3fcAEfF7f078",
            //                 "1": "0x0000000000000000000000000000000000000000",
            //                 "2": "16",
            //                 "from": "0x0d1B527D41225C021b26B6832bBe3fcAEfF7f078",
            //                 "to": "0x0000000000000000000000000000000000000000",
            //                 "tokenId": "16"
            //         },
            //         "event": "Transfer",
            //             "signature": "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            //             "raw": {
            //             "data": "0x",
            //                 "topics": [
            //                 "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            //                 "0x0000000000000000000000000d1b527d41225c021b26b6832bbe3fcaeff7f078",
            //                 "0x0000000000000000000000000000000000000000000000000000000000000000",
            //                 "0x0000000000000000000000000000000000000000000000000000000000000010"
            //             ]
            //         }
            //     }
            // }
            // }
        }).catch(error => {
            console.log(error);
        })
    }

    const agreeCheck = (agree) => {
        if(agree){
            setAgreeState(true);
        } else {
            setAgreeState(false);
        }
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
        setHomeAddress([data.zonecode, fullAddress]);
        postModalClose();
    }

    const postCodeStyle = {
        display: "block",
        height: "500px",
        background: "#eee"
    };
    return (
        <>
            {props.accounts && props.accounts.length > 0 && props.isConnected === 'YES' ? (
                <section className={styles.my_nft_list}>
                    <h1>My Ticket NFT</h1>
                    <div className={styles.container}>
                        {
                            <div className={styles.box}>
                                {nftList.map((item, index) => (
                                    <div key={index} className={styles.img_box}>
                                        {(() => {
                                            switch (item.use) {
                                                case "Y":
                                                    return <a onClick={() => {
                                                        modalFadeIn(item.tokenId)
                                                    }} className="">
                                                        <video src={item.image}/>
                                                        #{parseInt(item.tokenId, 16)} GIFT
                                                    </a>;
                                                case "N":
                                                    return <a onClick={() => {
                                                        modalFadeIn(item.tokenId)
                                                    }} className="">
                                                        <div className={styles.disable}>
                                                            <video className={styles.disable} src={item.image}/>
                                                            <span className={styles.disable_stamp}></span>
                                                            <s>#{parseInt(item.tokenId, 16)} GIFT</s>
                                                        </div>
                                                    </a>;
                                            }
                                        })()}
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
                </section>
            ) : (
                <section className={styles.my_nft_list}>
                    <h1>My Ticket NFT</h1>
                    <div className={styles.container}>
                        <div className={styles.no_wallet}>
                            <img src={connectIcon}/>
                            <p>Please connect wallet</p>
                        </div>
                    </div>
                </section>
            )
            }
            <LoadingModal showLoading={showLoading} setShowLoading={setShowLoading}/>
            <Modal size="lg" show={modalShow} onHide={modalClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="mx-auto">My Ticket 신청하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.term_box}>
                        <span className={styles.pop_title}><img src={popIcon}/> 개인정보수집약관</span>
                        <p className={styles.term_text}>
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                            약관내용약관내용약관내용약관내용약관내용약관내용약관내용약관내용
                        </p>
                        <input ref={agreeBox}
                               type="checkbox" name={"agree"} onChange={e => {
                            agreeCheck(e.target.checked);
                        }}
                        /> 위 약관에 동의합니다.
                    </div>
                    <div>
                        <span className={styles.pop_title}><img src={popIcon}/> 주소입력</span>
                        <form>
                            <div className={styles.pop_form}>
                                <label>성명</label>
                                <input ref={formName} style={{width: "250px"}} type={"text"} name={"name"}/>
                            </div>
                            <div className={styles.pop_form}>
                                <label>연락처</label>
                                <select ref={formPhoneNumber1} style={{width: "100px"}} name={"ph1"}>
                                    <option value={""}>선택</option>
                                    <option value={"010"}>010</option>
                                    <option value={"011"}>011</option>
                                    <option value={"016"}>011</option>
                                    <option value={"017"}>017</option>
                                    <option value={"018"}>017</option>
                                    <option value={"019"}>017</option>
                                </select>-
                                <input ref={formPhoneNumber2} maxLength={4} style={{width: "100px"}} type={"text"} name={"ph2"}/> -
                                <input ref={formPhoneNumber3} maxLength={4} style={{width: "100px"}} type={"text"} name={"ph3"}/>
                            </div>
                            <div className={styles.pop_form} style={{display: "flex", borderBottom: "3px solid #999"}}>
                                <label>주소</label>
                                <div style={{width: "calc(100% - 120px)"}}>
                                    <a onClick={postModalOpen}>주소검색</a>
                                    <input ref={formPostZip} type="text" name={"post"} value={homeAddress[0]} placeholder="우편번호"
                                           readOnly/><br/>
                                    <input ref={formPostAddress} style={{width: "calc(100% - 20px)"}} type="text" name={"address1"} value={homeAddress[1]} placeholder="주소" readOnly/><br/>
                                    <input ref={formPostAddress2} style={{width: "calc(100% - 20px)"}} type="text" name={"address2"} placeholder="상세주소"/>
                                </div>
                            </div>
                        </form>
                        <span style={{color: "red"}}>* 신청이 완료되면 보유한 NFT는 소각 처리됩니다.</span><br/>
                        <span style={{color: "red"}}>* TokenID : {nftTokenId}</span><br/>
                        <div className={styles.btnBox}>
                            <button onClick={modalClose}>
                                취소
                            </button>
                            <button onClick={() => {nftTransfer(nftTokenId)}}>
                                제출
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={postModalShow} onHide={postModalClose}>
                <DaumPostcode style={postCodeStyle} onComplete={handlePostCode}/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {postModalClose()}}>
                        취소
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default MyNftList
