import React from 'react';
import { Modal, Button, ModalProps } from 'react-bootstrap';

interface PopupProps extends ModalProps {
    title: string;
    content: string;
    onHide: () => void;
}

const Popup: React.FC<PopupProps> = (props) => {
    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{props.content}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Popup;