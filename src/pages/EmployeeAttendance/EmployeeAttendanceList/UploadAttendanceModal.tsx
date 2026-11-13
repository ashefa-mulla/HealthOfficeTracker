import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
} from 'reactstrap';
import employeeAttendanceService from '@/services/employeeAttendanceService';
import toastService from '@/services/toastService';
import { UploadAttendanceResult } from '@/types/employeeAttendance/employeeAttendance.types';

interface UploadAttendanceModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSuccess?: () => void;
}

const UploadAttendanceModal: React.FC<UploadAttendanceModalProps> = ({
  isOpen,
  toggle,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<UploadAttendanceResult | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setIsUploading(false);
    setDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModalClose = () => {
    if (isUploading) return;
    resetState();
    toggle();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValid) {
      toastService.error('Invalid file type. Please select an Excel (.xlsx, .xls) or CSV file.');
      return;
    }

    setSelectedFile(file);
    setUploadResult(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toastService.warning('Please select an Excel or CSV file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await employeeAttendanceService.uploadAttendanceExcel(selectedFile);
      setUploadResult(result);

      if (result.success) {
        toastService.success(result.message || 'Attendance Excel processed successfully.');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toastService.warning(result.message || 'Excel processed with some errors.');
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to upload attendance excel.';
      toastService.error(msg);
      setUploadResult({
        success: false,
        message: msg,
        totalRows: 0,
        insertedCount: 0,
        updatedCount: 0,
        failedCount: 0,
        errors: [msg],
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={isUploading ? undefined : handleModalClose}
      size="lg"
      centered
      backdrop="static"
    >
      <ModalHeader toggle={isUploading ? undefined : handleModalClose}>
        <div className="d-flex align-items-center gap-2">
          <i className="mdi mdi-file-excel text-success font-size-22"></i>
          <span className="fw-bold">Upload Attendance Excel / CSV</span>
        </div>
      </ModalHeader>

      <ModalBody className="p-4">
        {/* Upload Result Alert / Summary */}
        {uploadResult && (
          <div className="mb-4">
            <Alert
              color={uploadResult.success ? (uploadResult.failedCount ? 'warning' : 'success') : 'danger'}
              className="d-flex flex-column gap-2"
            >
              <div className="d-flex align-items-center gap-2 fw-semibold">
                <i
                  className={`mdi ${
                    uploadResult.success
                      ? uploadResult.failedCount
                        ? 'mdi-alert-circle-outline'
                        : 'mdi-check-circle-outline'
                      : 'mdi-close-circle-outline'
                  } font-size-18`}
                ></i>
                <span>{uploadResult.message}</span>
              </div>

              {/* Statistics Badges */}
              {(uploadResult.totalRows !== undefined ||
                uploadResult.insertedCount !== undefined ||
                uploadResult.updatedCount !== undefined) && (
                <Row className="g-2 mt-1">
                  <Col xs={6} sm={3}>
                    <div className="bg-white border rounded p-2 text-center">
                      <div className="small text-muted">Total Rows</div>
                      <div className="fs-5 fw-bold text-dark">{uploadResult.totalRows ?? 0}</div>
                    </div>
                  </Col>
                  <Col xs={6} sm={3}>
                    <div className="bg-white border border-success-subtle rounded p-2 text-center">
                      <div className="small text-success">Inserted</div>
                      <div className="fs-5 fw-bold text-success">{uploadResult.insertedCount ?? 0}</div>
                    </div>
                  </Col>
                  <Col xs={6} sm={3}>
                    <div className="bg-white border border-info-subtle rounded p-2 text-center">
                      <div className="small text-info">Updated</div>
                      <div className="fs-5 fw-bold text-info">{uploadResult.updatedCount ?? 0}</div>
                    </div>
                  </Col>
                  <Col xs={6} sm={3}>
                    <div className="bg-white border border-danger-subtle rounded p-2 text-center">
                      <div className="small text-danger">Failed</div>
                      <div className="fs-5 fw-bold text-danger">{uploadResult.failedCount ?? 0}</div>
                    </div>
                  </Col>
                </Row>
              )}

              {/* Error Details */}
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="mt-2">
                  <div className="fw-semibold text-danger small mb-1">Row Errors / Warnings:</div>
                  <div
                    className="bg-white border rounded p-2"
                    style={{ maxHeight: 150, overflowY: 'auto', fontSize: 12 }}
                  >
                    <ul className="mb-0 ps-3 text-danger">
                      {uploadResult.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Alert>
          </div>
        )}

        {/* Drag & Drop File Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? '#0b4d9c' : '#cbd5e1'}`,
            borderRadius: 12,
            backgroundColor: dragActive ? '#f0f7ff' : '#f8fafc',
            padding: '36px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div className="mb-2">
            <i
              className="mdi mdi-cloud-upload text-primary"
              style={{ fontSize: 44, opacity: 0.85 }}
            ></i>
          </div>

          <h6 className="fw-bold mb-1 text-dark">
            {selectedFile ? selectedFile.name : 'Choose an Excel or CSV file'}
          </h6>

          <p className="text-muted small mb-2">
            {selectedFile
              ? `Size: ${formatFileSize(selectedFile.size)}`
              : 'Drag & drop your file here, or click to browse'}
          </p>

          <span className="badge bg-light text-muted border px-2 py-1">
            Supported formats: .xlsx, .xls, .csv
          </span>
        </div>

        {/* Selected File Details Bar */}
        {selectedFile && (
          <div className="d-flex align-items-center justify-content-between bg-light rounded p-2 px-3 mt-3 border">
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <i className="mdi mdi-file-excel-box text-success font-size-20"></i>
              <div className="text-truncate" style={{ maxWidth: 450 }}>
                <span className="fw-semibold text-dark small">{selectedFile.name}</span>
                <span className="text-muted small ms-2">({formatFileSize(selectedFile.size)})</span>
              </div>
            </div>
            <Button
              color="link"
              className="text-danger p-0 ms-2 text-decoration-none"
              onClick={(e) => {
                e.stopPropagation();
                resetState();
              }}
              title="Remove file"
              disabled={isUploading}
            >
              <i className="mdi mdi-close-circle font-size-18"></i>
            </Button>
          </div>
        )}

        {/* Expected Format Guidance Card */}
        <div className="mt-4 p-3 border rounded-3 bg-light">
          <div className="fw-semibold text-dark small mb-2 d-flex align-items-center gap-1">
            <i className="mdi mdi-information-outline text-primary font-size-16"></i>
            <span>Expected Excel / CSV Columns</span>
          </div>
          <div className="table-responsive">
            <table
              className="table table-sm table-bordered bg-white mb-1"
              style={{ fontSize: 12 }}
            >
              <thead className="table-light">
                <tr>
                  <th>empcd</th>
                  <th>month</th>
                  <th>year</th>
                  <th>workingdays</th>
                  <th>attendance</th>
                  <th>pl</th>
                  <th>cl</th>
                  <th>sl</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-muted">101 / EMP01</td>
                  <td className="text-muted">1 - 12</td>
                  <td className="text-muted">2026</td>
                  <td className="text-muted">26</td>
                  <td className="text-muted">24</td>
                  <td className="text-muted">1</td>
                  <td className="text-muted">1</td>
                  <td className="text-muted">0</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-muted" style={{ fontSize: 11 }}>
            * Header names are case-insensitive. Accepts column aliases like <code>empcode</code>, <code>employeeid</code>, <code>mth</code>, <code>yr</code>, <code>workdays</code>, <code>present</code>.
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="d-flex justify-content-between">
        <Button
          color="secondary"
          outline
          onClick={handleModalClose}
          disabled={isUploading}
        >
          {uploadResult?.success ? 'Close' : 'Cancel'}
        </Button>

        <div className="d-flex gap-2">
          {uploadResult && (
            <Button
              color="outline-primary"
              onClick={resetState}
              disabled={isUploading}
            >
              <i className="mdi mdi-refresh me-1"></i> Upload Another
            </Button>
          )}

          <Button
            color="success"
            className="d-flex align-items-center gap-1 px-3"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Spinner size="sm" className="me-1" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <i className="mdi mdi-cloud-upload me-1"></i>
                <span>Upload & Process</span>
              </>
            )}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default UploadAttendanceModal;

