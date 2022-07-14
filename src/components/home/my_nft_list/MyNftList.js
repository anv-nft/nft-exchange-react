import React, {useEffect, useRef, useState} from 'react'
import {Modal, Button, Form} from 'react-bootstrap';
import {POST} from "../../../api/api";
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
    const contractAddress = "0x7653556eec6a827c18a9481c6d6df27244cd6049";
    const [accounts, setAccounts] = useState([]);

    const nftListRef = useRef([]);
    const [nftList, setNftList] = useState([])

    const [showLoading, setShowLoading] = useState(false); // 로딩 모달



    const [nftTokenId, setNftTokenId] = useState(); //선택 토큰

    // 교환정보 입력 모달
    const [modalShow, setModalShow] = useState(false);
    const modalClose = () => setModalShow(false);
    const modalOpen = () => setModalShow(true);
    const agreeBox = useRef();
    const formName = useRef();
    const formPhoneNumber1 = useRef();
    const formPhoneNumber2 = useRef();
    const formPhoneNumber3 = useRef();
    const formPostZip = useRef();
    const formPostAddress = useRef();
    const formPostAddress2 = useRef();
    const [agreeState, setAgreeState] = useState(false); // 동의 여부
    const [postUseState, setPostUseState] = useState(false); // 주소 사용 여부
    // 주소창 모달
    const [postModalShow, setPostModalShow] = useState(false);
    const postModalClose = () => setPostModalShow(false);
    const postModalOpen = () => setPostModalShow(true);
    // 교환정보확인 모달
    const [viewModalShow, setViewModalShow] = useState(false);
    const viewModalClose = () => setViewModalShow(false);
    const viewModalOpen = () => setViewModalShow(true);
    const [viewForm, setViewForm] = useState(['Name','Hp','Zip','Address','Address2']);


    // const [formPhoneNumber, setFormPhoneNumber] = useState([]); // 연락처
    const [homeAddress, setHomeAddress] = useState([]);
    let history = useHistory();

    useEffect(() => {
        if(props.accounts[0] !== undefined && props.apiToken){
            getMyNftList();
        }
    }, [props.accounts]);

    useEffect(() => {
        setHomeAddress([]);
        setAgreeState(false);
    }, [nftTokenId]);

    async function getMyNftList() {
        try{
            const res = await POST(`/api/v1/exchange/getnft`,{address:props.accounts}, props.apiToken);
            let listOfNft = [];

            for (let i = 0; i < res.data.length; i++) {
                const item = res.data[i];

                listOfNft.push(item);
            }
            nftListRef.current = listOfNft;
            setNftList(nftListRef.current);
        }catch (e){
            await props.handleLogout();
            console.log(e);
        }
    }

    function modalFadeIn(tokenId,postUse) {
        setNftTokenId(tokenId);
        setPostUseState(postUse);
        modalOpen();
    }
    async function viewModalFadeIn(tokenId,postUse) {
        setNftTokenId(tokenId);
        setPostUseState(postUse);
        const res = await POST(`/api/v1/exchange/info`,{tokenId}, props.apiToken);
        setViewForm([res.data.name, res.data.hp, res.data.zip, res.data.address, res.data.address2]);
        viewModalOpen();
    }
    async function nftTransfer(nftToken) {
        if(!agreeState){
            alert("개인정보 수집 약관에 동의 해주세요.");
            console.log(agreeBox.current);
            return agreeBox.current.focus();
        }
        const regName = /^[가-힣]{2,4}|[a-zA-Z]{2,10}\s[a-zA-Z]{2,10}$/;
        if(formName.current.value == ""){
            alert("성명을 입력해주세요.");
            return formName.current.focus();
        }
        if(regName.test(formName.current.value) === false){
            alert("성명은 한글 또는 영문 한가지만 사용 가능합니다.");
            return formName.current.focus();
        }

        if(formPhoneNumber1.current.value == ""){
            alert("연락처 앞자리를 선택해주세요.");
            return formPhoneNumber1.current.focus();
        }
        if(formPhoneNumber2.current.value == ""){
            alert("연락처를 입력해주세요.");
            return formPhoneNumber2.current.focus();
        }
        const regPhone2 = /([0-9]{3,4})$/;
        if(regPhone2.test(formPhoneNumber2.current.value) === false){
            alert("숫자 3~4자리를 입력해주세요.");
            return formPhoneNumber2.current.focus();
        }
        if(formPhoneNumber3.current.value == ""){
            alert("연락처를 입력해주세요.");
            return formPhoneNumber3.current.focus();
        }
        const regPhone3 = /([0-9]{4})$/;
        if(regPhone3.test(formPhoneNumber3.current.value) === false){
            alert("숫자 4자리를 입력해주세요.");
            return formPhoneNumber3.current.focus();
        }
        if(postUseState){
            if(formPostZip.current.value == "" || formPostAddress.current.value == ""){
                alert("주소를 입력해주세요.");
                return formPostZip.current.focus();
            }
            if(formPostAddress2.current.value == ""){
                alert("상세주소를 입력해주세요.");
                return formPostAddress2.current.focus();
            }
        }
        try{
            const saveData = {
                tokenId: nftToken,
                ownerId: props.accounts[0],
                exchangeName: formName.current.value,
                exchangeHp: `${formPhoneNumber1.current.value}-${formPhoneNumber2.current.value}-${formPhoneNumber3.current.value}`,
                exchangeZip: formPostZip.current.value,
                exchangeAddress: formPostAddress.current.value,
                exchangeAddress2: formPostAddress2.current.value,
            }
            const saveResult = await POST(`/api/v1/exchange/save`, saveData, props.apiToken);
            if(saveResult.result == 'success'){
                const provider = window['klaytn'];
                const caver = new Caver(provider);
                const kip17instance = new caver.klay.KIP17(contractAddress);
                const sender = props.accounts[0];
                const tokenNumber = parseInt(nftToken, 16);
                await kip17instance.burn(tokenNumber,  {from: sender}).then(async (result) => {
                    const saveTransactionData = {
                        contractAddress,
                        tokenId: nftToken,
                        ownerId: props.accounts[0],
                        transactionHash: result.transactionHash,
                    }
                    const saveTransactionResult = await POST(`/api/v1/exchange/save/transaction`, saveTransactionData, props.apiToken);
                    if(saveTransactionResult.result == 'success'){
                        alert('신청이 완료 되었습니다.');
                    } else {
                        alert('신청중 오류가 발생하였습니다.');
                    }
                }).catch(error => {
                    alert('소각 실패');
                    console.log(error);
                })
            } else {
                alert('개인정보 저장중 오류가 발생하였습니다.');
            }
        } catch (e){
            alert('신청 실패');
            console.log(e);
        }
        getMyNftList();
        modalClose();
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
                                            if(item.is_complete == "N"){
                                                switch (item.is_exchanged) {
                                                    case "N":
                                                        return <a onClick={() => {
                                                            modalFadeIn(item.token_id, item.is_need_addr)
                                                        }} className="">
                                                            <img src={item.image}/>
                                                            #{parseInt(item.token_id, 16)} {item.name} GIFT
                                                        </a>;
                                                    case "Y":
                                                        return <a onClick={() => {
                                                            viewModalFadeIn(item.token_id, item.is_need_addr)
                                                        }}>
                                                            <img className={styles.disable} src={item.image}/>
                                                            <s>#{parseInt(item.token_id, 16)} {item.name} GIFT</s>
                                                        </a>;
                                                }
                                            } else {
                                                return <div className={styles.complete}>
                                                    <img src={item.image}/>
                                                    <span className={styles.complete_stamp}></span>
                                                    <s>#{parseInt(item.token_id, 16)} {item.name} GIFT</s>
                                                </div>;
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
                            개인 정보 수집·이용 동의<br/>
                            <br/>
                            수집된 회원님의 개인 정보는 본인 확인 및 상품 지급 이외의 목적으로 활용되지 않습니다.<br/>
                            <br/>
                            · 개인 정보 수집·이용 동의(필수)<br/>
                            - 수집 및 이용 목적 : 본인 확인 및 상품 지급<br/>
                            - 수집 항목 : 이름, 주소, 휴대폰 번호, 카이카스 지갑 주소<br/>
                            - 보유 및 이용 기간 : 이벤트 종료 후 30일 동안 보유하며, 원칙적으로 개인 정보의 수집 및 이용 목적이 달성 되면 지체 없이 파기함<br/>
                            <br/>
                            ※ 개인정보 수집·이용에 대하여 동의를 거부할 권리를 가지고 있으며, 개인정보 수집·이용에 대한 미동의 시 이벤트에 참여하실 수 없습니다.<br/>
                        </p>
                        <input ref={agreeBox}
                               type="checkbox" name={"agree"} onChange={e => {
                            agreeCheck(e.target.checked);
                        }}
                        /> 위 약관에 동의합니다.
                    </div>
                    <div>
                        <span className={styles.pop_title}><img src={popIcon}/> 개인정보</span>
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
                            {postUseState &&
                                <div className={styles.pop_form}
                                     style={{display: "flex", borderBottom: "3px solid #999"}}>
                                    <label>주소</label>
                                    <div style={{width: "calc(100% - 120px)"}}>
                                        <a onClick={postModalOpen}>주소검색</a>
                                        <input ref={formPostZip} type="text" name={"post"} value={homeAddress[0] || ''}
                                               placeholder="우편번호"
                                               readOnly/><br/>
                                        <input ref={formPostAddress} style={{width: "calc(100% - 20px)"}} type="text"
                                               name={"address1"} value={homeAddress[1] || ''} placeholder="주소" readOnly/><br/>
                                        <input ref={formPostAddress2} style={{width: "calc(100% - 20px)"}} type="text"
                                               name={"address2"} placeholder="상세주소"/>
                                    </div>
                                </div>
                            }
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
            {/*주소 모달*/}
            <Modal show={postModalShow} onHide={postModalClose}>
                <DaumPostcode style={postCodeStyle} onComplete={handlePostCode}/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {postModalClose()}}>
                        취소
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*정보확인 모달*/}
            <Modal size="lg" show={viewModalShow} onHide={viewModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="mx-auto">My Ticket 신청정보</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <span className={styles.pop_title}><img src={popIcon}/> 개인정보</span>
                            <div className={styles.pop_form}>
                                <label>성명</label>
                                {viewForm[0]}
                            </div>
                            <div className={styles.pop_form}>
                                <label>연락처</label>
                                {viewForm[1]}
                            </div>
                            {postUseState &&
                                <div className={styles.pop_form}
                                     style={{display: "flex", borderBottom: "3px solid #999"}}>
                                    <label>주소</label>
                                    <div style={{width: "calc(100% - 120px)"}}>
                                        {viewForm[2]}<br/>
                                        {viewForm[3]}<br/>
                                        {viewForm[4]}
                                    </div>
                                </div>
                            }
                        <span style={{color: "red"}}>* TokenID : {nftTokenId}</span><br/>
                        <div className={styles.btnBox}>
                            <button onClick={viewModalClose}>
                                닫기
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default MyNftList
