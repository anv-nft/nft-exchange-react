import React from 'react'
import {Modal} from 'react-bootstrap';
import LoadingImage from "../../assets/images/loading_img.png";


function LoadingModal(props) {

    return (
        <Modal className="network_modal loading_box" centered size="xs" show={props.showLoading}
               onHide={() => props.setShowLoading(false)}>
            <Modal.Body className="">
                <div className="loading_box_text_001"> Loading...</div>
                <div className="modal_loading mt-3">
                    <div className="loading">
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                        <div className="obj"></div>
                    </div>
                </div>
                <img className="LoadingModalImage" src={LoadingImage} alt=""/>
            </Modal.Body>
        </Modal>
    )
}

export default LoadingModal
