import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import { CategoryListItem } from '@/types/category/category.types';
import { fetchCategoryList, removeCategory } from '@/slices/category/categoryThunk';

const formatPrice = (v: any): string => {
  if (v === undefined || v === null || v === '') return '-';
  const n = Number(v);
  return isNaN(n) ? String(v) : n.toFixed(2);
};

const CategoryList: React.FC = () => {
  document.title = 'Categories | HO Tracker';

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const { list, loading, saving } = useSelector(
    (state: RootState) => (state as any).Category
  );

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategoryList());
  }, [dispatch]);

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removeCategory(selectedDeleteId)).unwrap();
      dispatch(fetchCategoryList());
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const columns = useMemo<ColumnDef<CategoryListItem, any>[]>(
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
        cell: (info) => info.row.original.project || '-',
      },
      {
        header: 'Project',
        accessorKey: 'subproject',
        enableColumnFilter: false,
        cell: (info) => info.row.original.subproject || '-',
      },
      {
        header: 'Category',
        accessorKey: 'subcategory',
        enableColumnFilter: false,
        cell: (info) => (
          <span style={{ fontWeight: 500 }}>{info.row.original.subcategory || '-'}</span>
        ),
      },
      {
        header: 'Description',
        accessorKey: 'description',
        enableColumnFilter: false,
        cell: (info) => info.row.original.description || '-',
      },
      {
        header: 'Price($)',
        accessorKey: 'amount',
        enableColumnFilter: false,
        cell: (info) => formatPrice(info.row.original.amount),
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
                to={`/area/category/edit/${id}`}
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
            <h1 className="page-title-main">Categories</h1>
          </div>
        </div>
        <TableContainer
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search category..."
          searchAddLayout={true}
          isAddButton={true}
          buttonName="+ Add"
          buttonClass="btn-task-add-new"
          handleUserClick={() => navigate('/area/category/create')}
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No categories found."
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

export default CategoryList;
