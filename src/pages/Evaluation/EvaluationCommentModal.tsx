import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";

export interface WeekNote {
  comment: string;
  additionalPoints: number | null;
  additionalComment: string;
}

interface Props {
  isOpen: boolean;
  weekLabel: string;
  value: WeekNote;
  readOnly: boolean;
  onClose: () => void;
  onApply: (note: WeekNote) => void;
}

/**
 * Comment for one question in one week. Applied locally; saved with the evaluation.
 * Additional points / comment already on the record are kept untouched.
 */
const EvaluationCommentModal: React.FC<Props> = ({
  isOpen,
  weekLabel,
  value,
  readOnly,
  onClose,
  onApply,
}) => {
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isOpen) setComment(value.comment);
  }, [isOpen, value]);

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose}>Comment - {weekLabel}</ModalHeader>
      <ModalBody>
        <Input
          type="textarea"
          rows={5}
          placeholder="Enter comment..."
          value={comment}
          disabled={readOnly}
          onChange={(e) => setComment(e.target.value)}
          style={{ fontSize: "11px" }}
        />
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className="btn btn-sm text-white fw-semibold px-4"
          style={{ background: "#2b9bd8" }}
          onClick={onClose}
        >
          {readOnly ? "Close" : "Cancel"}
        </button>
        {!readOnly && (
          <button
            type="button"
            className="btn btn-sm text-white fw-semibold px-4"
            style={{ background: "#0f4c8a" }}
            onClick={() =>
              onApply({
                comment: comment.trim(),
                additionalPoints: value.additionalPoints,
                additionalComment: value.additionalComment,
              })
            }
          >
            Save
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default EvaluationCommentModal;
