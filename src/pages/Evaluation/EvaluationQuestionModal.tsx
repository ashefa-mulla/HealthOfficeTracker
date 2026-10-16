import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Input } from "reactstrap";
import toastService from "@/services/toastService";

interface Props {
  isOpen: boolean;
  /** 0 = add, > 0 = edit */
  questionId: number;
  initialText: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (questionText: string) => void;
}

/** Add / edit an evaluation question (text only, like the old Angular screen). */
const EvaluationQuestionModal: React.FC<Props> = ({
  isOpen,
  questionId,
  initialText,
  saving,
  onClose,
  onSubmit,
}) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (isOpen) setText(initialText);
  }, [isOpen, initialText]);

  const handleSave = () => {
    if (!text.trim()) {
      toastService.error("Please enter question text.");
      return;
    }
    onSubmit(text.trim());
  };

  return (
    <Modal isOpen={isOpen} toggle={saving ? undefined : onClose} centered>
      <ModalHeader toggle={saving ? undefined : onClose}>
        {questionId > 0 ? "Edit Question" : "Add New Question"}
      </ModalHeader>
      <ModalBody>
        <Input
          type="text"
          placeholder="Enter question text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            }
          }}
          style={{ fontSize: "11px" }}
        />
      </ModalBody>
      <ModalFooter>
        <button type="button" className="btn-form-action-back" onClick={onClose} disabled={saving}>
          Cancel
        </button>
        <button type="button" className="btn-form-action-save" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Spinner size="sm" className="me-2 text-white" />
              Saving...
            </>
          ) : questionId > 0 ? (
            "Update"
          ) : (
            "Add"
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default EvaluationQuestionModal;
