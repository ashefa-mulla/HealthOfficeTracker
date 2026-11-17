import React, { useEffect, useState, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Spinner,
  Badge,
  Table,
  Input,
} from 'reactstrap';
import { EmployeeSalaryRevisionModel } from '@/types/salaryRevision/salaryRevision.types';
import salaryRevisionService from '@/services/salaryRevisionService';
import toastService from '@/services/toastService';
import { formatDateOnly } from '@/helpers/dateHelper';
import SalaryRevisionModal from './SalaryRevisionModal';
import DeleteModal from '@/Components/Common/DeleteModal';

interface EmployeeSalaryTabProps {
  employeeId: number;
}

const EmployeeSalaryTab: React.FC<EmployeeSalaryTabProps> = ({ employeeId }) => {
  const [revisions, setRevisions] = useState<EmployeeSalaryRevisionModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination & Search states
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');

  // Modal states
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedRevision, setSelectedRevision] = useState<EmployeeSalaryRevisionModel | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const loadSalaryRevisions = useCallback(
    async (page: number = 1, size: number = 100, search?: string) => {
      if (!employeeId || employeeId <= 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await salaryRevisionService.getSalaryRevisionsByEmpId(employeeId, {
          pageNumber: page,
          pageSize: size,
          search: search?.trim() ? search.trim() : undefined,
        });

        const list = res?.data || [];
        setRevisions(list);
        setTotalRecords(res?.totalCount ?? list.length);
        setTotalPages(res?.totalPages ?? (Math.ceil(list.length / size) || 1));
        setPageNumber(res?.currentPage ?? page);
        setPageSize(res?.pageSize ?? size);
      } catch (err: any) {
        console.error('Failed to load salary revisions:', err);
        toastService.error(err?.message || 'Failed to load salary revisions.');
      } finally {
        setLoading(false);
      }
    },
    [employeeId]
  );

  // Trigger search on change with 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPageNumber(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadSalaryRevisions(pageNumber, pageSize, searchTerm);
  }, [loadSalaryRevisions, pageNumber, pageSize, searchTerm]);

  const handleSearchReset = () => {
    setSearchInput('');
    setSearchTerm('');
    setPageNumber(1);
  };

  const handleOpenAddModal = () => {
    setSelectedRevision(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (rev: EmployeeSalaryRevisionModel) => {
    setSelectedRevision(rev);
    setModalOpen(true);
  };

  const handleOpenDeleteModal = (id: number) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await salaryRevisionService.deleteSalaryRevision(deleteId);
      toastService.success('Salary revision deleted successfully.');
      setDeleteModalOpen(false);
      setDeleteId(null);
      loadSalaryRevisions(pageNumber, pageSize, searchTerm);
    } catch (err: any) {
      console.error('Failed to delete salary revision:', err);
      toastService.error(err?.message || 'Failed to delete salary revision.');
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount?: number | null): string => {
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return '₹0.00';
    }
    return `₹${Number(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (!employeeId || employeeId <= 0) {
    return (
      <div className="text-center py-5">
        <div className="avatar-md mx-auto mb-3">
          <div className="avatar-title bg-light text-primary rounded-circle font-size-24">
            <i className="mdi mdi-information-outline"></i>
          </div>
        </div>
        <h5 className="text-dark fw-bold">Save Team Member First</h5>
        <p className="text-muted" style={{ maxWidth: 450, margin: '0 auto' }}>
          Please save this team member's general information first. Once created, you will be able to manage salary revisions here.
        </p>
      </div>
    );
  }

  const employeeName =
    revisions[0]?.fullname ||
    revisions[0]?.Fullname ||
    '';

  return (
    <div className="salary-revision-tab-content">
      {/* Tab Header & Action Bar */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 pb-2 border-bottom">
        <div>
          <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <i className="mdi mdi-cash-multiple text-primary font-size-22"></i>
            Salary Revisions {employeeName ? `— ${employeeName}` : ''}
          </h5>
          <p className="text-muted small mb-0">
            View, track, and revise basic salary structure and matrix points for this team member.
          </p>
        </div>
        <Button
          color="primary"
          className="d-flex align-items-center gap-1 shadow-sm"
          style={{ minHeight: 38, borderRadius: 8, fontWeight: 500 }}
          onClick={handleOpenAddModal}
        >
          <i className="mdi mdi-plus font-size-18"></i>
          <span>Add Salary Revision</span>
        </Button>
      </div>

      {loading && revisions.length === 0 ? (
        <div className="text-center py-5">
          <Spinner color="primary" />
          <p className="mt-2 text-muted fw-medium">Loading salary details...</p>
        </div>
      ) : (
        <>
          {/* Search Toolbar */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h6 className="fw-semibold text-dark mb-0 d-flex align-items-center gap-1">
              <i className="mdi mdi-history font-size-18 text-primary"></i>
              Revision History {totalRecords > 0 ? `(${totalRecords})` : ''}
            </h6>

            <div className="position-relative" style={{ minWidth: 260 }}>
              <i
                className="mdi mdi-magnify position-absolute start-0 top-50 translate-middle-y text-muted ms-2"
                style={{ fontSize: 16, pointerEvents: 'none' }}
              ></i>
              <Input
                type="text"
                placeholder="Search revisions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                bsSize="sm"
                style={{
                  borderRadius: 8,
                  paddingLeft: 30,
                  paddingRight: searchInput ? 30 : 12,
                }}
              />
              {searchInput && (
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted p-1 me-1"
                  onClick={handleSearchReset}
                  style={{ textDecoration: 'none', lineHeight: 1 }}
                  title="Clear search"
                >
                  <i className="mdi mdi-close font-size-14"></i>
                </button>
              )}
            </div>
          </div>

          {/* Salary Revision History Table */}
          {revisions.length === 0 ? (
            <Card className="border shadow-none rounded-3 text-center py-5 bg-light">
              <CardBody>
                <div className="text-muted mb-3 font-size-36">
                  <i className="mdi mdi-cash-remove"></i>
                </div>
                <h6 className="text-dark fw-bold mb-1">
                  {searchTerm ? 'No Matching Revisions Found' : 'No Salary Revisions Found'}
                </h6>
                <p className="text-muted small mb-3">
                  {searchTerm
                    ? `No salary revisions matched your search "${searchTerm}".`
                    : 'No salary revision records have been added for this team member yet.'}
                </p>
                {searchTerm ? (
                  <Button color="secondary" size="sm" outline onClick={handleSearchReset}>
                    Clear Search
                  </Button>
                ) : (
                  <Button color="primary" size="sm" onClick={handleOpenAddModal}>
                    <i className="mdi mdi-plus me-1"></i> Add First Revision
                  </Button>
                )}
              </CardBody>
            </Card>
          ) : (
            <div className="table-responsive bg-white rounded-3 border shadow-sm">
              <Table className="table align-middle table-nowrap mb-0" hover>
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }}>Seq #</th>
                    <th>Basic Salary</th>
                    <th>Matrix Rate</th>
                    <th>Effective From</th>
                    <th>Effective To</th>
                    <th>Status</th>
                    <th style={{ width: '120px' }} className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {revisions.map((rev, index) => {
                    const idVal = Number(rev.id ?? rev.ID ?? 0);
                    const isRevActive =
                      rev.isActive === true ||
                      rev.IsActive === true ||
                      rev.isActive === 1 ||
                      rev.IsActive === 1 ||
                      String(rev.status || rev.Status).toLowerCase() === 'active';

                    const statusText =
                      rev.status ||
                      rev.Status ||
                      (isRevActive ? 'Active' : 'Inactive');

                    return (
                      <tr key={idVal || index}>
                        <td>
                          <span className="badge bg-light text-dark border">
                            #{rev.seqNo ?? rev.SeqNo ?? index + 1}
                          </span>
                        </td>
                        <td>
                          <span className="fw-bold text-dark">
                            {formatCurrency(rev.basic ?? rev.Basic)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <span className="fw-semibold text-primary">
                              {formatCurrency(rev.matrix ?? rev.Matrix)}
                            </span>
                            {Boolean(
                              rev.isCurrentMonthMatrix ??
                              rev.IsCurrentMonthMatrix ??
                              (rev as any).iscurrentmonthmatrix ??
                              (rev as any).is_current_month_matrix
                            ) && (
                              <Badge color="info" pill className="font-size-10 px-1 py-0 ms-1" title="Current Month Matrix">
                                Current
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">
                            {formatDateOnly(rev.fromDate ?? rev.FromDate)}
                          </span>
                        </td>
                        <td>
                          <span className="text-muted">
                            {(rev.toDate ?? rev.ToDate)
                              ? formatDateOnly(rev.toDate ?? rev.ToDate)
                              : 'Present'}
                          </span>
                        </td>
                        <td>
                          {isRevActive ? (
                            <Badge color="success" pill className="px-2 py-1">
                              {statusText}
                            </Badge>
                          ) : (
                            <Badge color="secondary" pill className="px-2 py-1">
                              {statusText}
                            </Badge>
                          )}
                        </td>
                        <td className="text-end">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-subtle-primary"
                              title="Edit Revision"
                              style={{ padding: '4px 8px' }}
                              onClick={() => handleOpenEditModal(rev)}
                            >
                              <i className="mdi mdi-pencil font-size-14 align-middle"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-subtle-danger"
                              title="Delete Revision"
                              style={{ padding: '4px 8px' }}
                              onClick={() => handleOpenDeleteModal(idVal)}
                            >
                              <i className="mdi mdi-delete font-size-14 align-middle"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination if multiple pages exist */}
          {totalPages > 1 && (
            <div className="d-flex align-items-center justify-content-between mt-3 px-1">
              <span className="text-muted small">
                Showing page {pageNumber} of {totalPages} ({totalRecords} records)
              </span>
              <div className="d-flex gap-1">
                <Button
                  color="light"
                  size="sm"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  color="light"
                  size="sm"
                  disabled={pageNumber >= totalPages}
                  onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Salary Revision Modal */}
      <SalaryRevisionModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        employeeId={employeeId}
        revision={selectedRevision}
        onSuccess={() => loadSalaryRevisions(pageNumber, pageSize, searchTerm)}
        nextSeqNo={totalRecords + 1}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={deleteModalOpen}
        onDeleteClick={handleConfirmDelete}
        onCloseClick={() => {
          setDeleteModalOpen(false);
          setDeleteId(null);
        }}
        loading={deleting}
      />
    </div>
  );
};

export default EmployeeSalaryTab;
