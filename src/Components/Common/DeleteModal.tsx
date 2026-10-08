import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

interface DeleteModalProps {
  show: boolean;
  onDeleteClick: () => void;
  onCloseClick: () => void;
  message?: string;
  loading?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  show,
  onDeleteClick,
  onCloseClick,
  message = 'Are you sure you want to permanently delete this record?',
  loading = false,
}) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button
            type="button"
            onClick={onCloseClick}
            className="btn-close position-absolute end-0 top-0 m-3"
            aria-label="Close"
          ></button>
          <div className="avatar-sm mb-4 mx-auto text-danger">
            <div
              className="d-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle mx-auto"
              style={{ width: '60px', height: '60px', fontSize: '28px' }}
            >
              <i className="mdi mdi-trash-can-outline"></i>
            </div>
          </div>
          <h5 className="mb-2">Confirm Delete</h5>
          <p className="text-muted font-size-15 mb-4">{message}</p>

          <div className="d-flex gap-2 justify-content-center mb-0">
            <button
              type="button"
              className="btn btn-danger px-4"
              onClick={onDeleteClick}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Deleting...
                </>
              ) : (
                'Delete Now'
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary px-4"
              onClick={onCloseClick}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default DeleteModal;
