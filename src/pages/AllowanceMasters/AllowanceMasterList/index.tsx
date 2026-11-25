import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import toastService from '@/services/toastService';
import allowanceMasterService from '@/services/allowanceMasterService';
import {
  ALLOWANCE_TYPE_LABELS,
  AllowanceMasterListItem,
} from '@/types/allowanceMaster/allowanceMaster.types';

const AllowanceMasterList: React.FC = () => {
  document.title = 'Allowance Master | HO Tracker';

  const navigate = useNavigate();

  const [list, setList] = useState<AllowanceMasterListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      setList(await allowanceMasterService.getAllowanceMasterList(true));
    } catch (err: any) {
      toastService.error(err?.message || 'Unable to load allowances.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    setDeleting(true);
    try {
      const res = await allowanceMasterService.deActivateAllowanceMaster(selectedDeleteId);
      toastService.success(res?.message || 'Allowance deactivated successfully.');
      await loadList();
    } catch (err: any) {
      toastService.error(err?.message || 'Unable to deactivate allowance.');
    } finally {
      setDeleting(false);
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<AllowanceMasterListItem, any>[]>(
    () => [
      {
        header: 'Allowance Name',
        accessorKey: 'allowanceName',
        enableColumnFilter: false,
        cell: (info) => <span style={{ fontWeight: 500 }}>{info.row.original.allowanceName || '-'}</span>,
      },
      {
        header: 'Allowance Code',
        accessorKey: 'allowanceCode',
        enableColumnFilter: false,
        cell: (info) => info.row.original.allowanceCode || '-',
      },
      {
        header: 'Allowance Type',
        accessorKey: 'allowanceType',
        enableColumnFilter: false,
        cell: (info) => {
          const code = info.row.original.allowanceType;
          return ALLOWANCE_TYPE_LABELS[code] ?? (code || '-');
        },
      },
      {
        header: 'Action',
        accessorKey: 'id',
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => {
          const id = Number(info.row.original.id || 0);
          return (
            <div className="d-flex align-items-center">
              <Link
                to={`/area/allowancemaster/edit/${id}`}
                className="task-action-icon me-2"
                title="Edit"
              >
                <i className="mdi mdi-pencil-outline"></i>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSelectedDeleteId(id);
                  setDeleteModal(true);
                }}
                className="task-action-icon delete-icon"
                title="Deactivate"
              >
                <i className="mdi mdi-trash-can-outline"></i>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="task-list-page-container">
        <div className="page-header-box">
          <div>
            <h1 className="page-title-main">Allowance Master</h1>
          </div>
        </div>

        <TableContainer
          columns={columns}
          data={list}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search allowance..."
          searchAddLayout={true}
          addButtonInFilterRow={true}
          isAddButton={true}
          buttonName="+ Add"
          buttonClass="btn-task-add-new"
          handleUserClick={() => navigate('/area/allowancemaster/create')}
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No allowances found."
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleConfirmDelete}
          onCloseClick={() => setDeleteModal(false)}
          message="Deactivate this allowance? It will no longer be available for new entries."
          loading={deleting}
        />
      </div>
    </React.Fragment>
  );
};

export default AllowanceMasterList;
