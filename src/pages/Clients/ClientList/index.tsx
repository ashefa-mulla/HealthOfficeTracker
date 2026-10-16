import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { ClientListItem } from '@/types/client/client.types';
import { fetchClientList, removeClient } from '@/slices/client/clientThunk';

const ClientList: React.FC = () => {
  document.title = 'Clients | HO Tracker';

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { list, loading, saving } = useSelector(
    (state: RootState) => (state as any).Client
  );

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchClientList());
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removeClient(selectedDeleteId)).unwrap();
      dispatch(fetchClientList());
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<ClientListItem, any>[]>(
    () => [
      {
        header: 'Company',
        accessorKey: 'company_Name',
        enableColumnFilter: false,
        cell: (info) => info.row.original.company_Name || '-',
      },
      {
        header: 'Client',
        accessorKey: 'project',
        enableColumnFilter: false,
        cell: (info) => (
          <span style={{ fontWeight: 500 }}>{info.row.original.project || '-'}</span>
        ),
      },
      {
        header: 'Description',
        accessorKey: 'project_Description',
        enableColumnFilter: false,
        cell: (info) => info.row.original.project_Description || '-',
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
                to={`/area/client/edit/${id}`}
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
                title="Delete"
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
            <h1 className="page-title-main">Clients</h1>
          </div>
        </div>
        <TableContainer
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search client..."
          searchAddLayout={true}
          isAddButton={true}
          buttonName="+ Add"
          buttonClass="btn-task-add-new"
          handleUserClick={() => navigate('/area/client/create')}
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No clients found."
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleConfirmDelete}
          onCloseClick={() => setDeleteModal(false)}
          loading={saving}
        />
      </div>
    </React.Fragment>
  );
};

export default ClientList;
