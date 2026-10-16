import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { RootState } from '@/slices';
import TableContainer from '@/Components/Common/TableContainer';
import DeleteModal from '@/Components/Common/DeleteModal';
import {
  PurchaseOrderListItem,
  PurchaseOrderView,
} from '@/types/purchaseOrder/purchaseOrder.types';
import {
  fetchPurchaseOrderList,
  removePurchaseOrder,
} from '@/slices/purchaseOrder/purchaseOrderThunk';
import { formatDateOnly } from '@/helpers/dateHelper';
import toastService from '@/services/toastService';

/** The list SPs return dates as text; show them formatted when parseable, otherwise as-is. */
const showDate = (v?: string | null): string => {
  if (!v) return '-';
  const formatted = formatDateOnly(v);
  return formatted === '-' ? String(v) : formatted;
};

const showAmount = (v: number): string =>
  Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const showAccountNo = (v: any): string =>
  v === null || v === undefined || v === ''
    ? '-'
    : typeof v === 'number'
      ? v.toLocaleString('fullwide', { useGrouping: false })
      : String(v);

const escapeHtml = (v: string): string =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const VIEWS: { key: PurchaseOrderView; label: string }[] = [
  { key: 'due', label: 'Due Date List' },
  { key: 'active', label: 'Active PO List' },
  { key: 'inactive', label: 'DeActive PO List' },
];

const PurchaseOrderList: React.FC = () => {
  document.title = 'Purchase Order | HO Tracker';

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const companyId = Number(localStorage.getItem('companyid')) || 1;

  const { list, loading, saving, view } = useSelector(
    (state: RootState) => (state as any).PurchaseOrder
  );

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);

  const loadList = useCallback(
    (v: PurchaseOrderView) => dispatch(fetchPurchaseOrderList({ view: v, companyId })),
    [dispatch, companyId]
  );

  useEffect(() => {
    loadList('due');
  }, [loadList]);

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await dispatch(removePurchaseOrder(selectedDeleteId)).unwrap();
      loadList(view);
    } finally {
      setDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  const handlePrint = () => {
    const rows: PurchaseOrderListItem[] = list || [];
    if (rows.length === 0) {
      toastService.error('Nothing to print.');
      return;
    }
    const title = VIEWS.find((v) => v.key === view)?.label || 'Purchase Order';
    const head = ['Next', 'Amount($)', 'Vendor', 'Payment Frequency', 'PO Type', 'Code', 'Account No'];
    const body = rows
      .map(
        (r) =>
          `<tr>${[
            showDate(r.nextDate),
            showAmount(r.amount),
            r.vendor || '-',
            r.paymentFrequency || '-',
            r.poType || '-',
            r.code || '-',
            showAccountNo(r.accountNo),
          ]
            .map((c) => `<td>${escapeHtml(String(c))}</td>`)
            .join('')}</tr>`
      )
      .join('');

    const win = window.open('', '_blank', 'width=1000,height=700');
    if (!win) {
      toastService.error('Please allow pop-ups to print.');
      return;
    }
    win.document.write(`<!doctype html><html><head><title>${escapeHtml(title)}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; margin: 24px; }
  h2 { margin: 0 0 12px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #999; padding: 6px 8px; text-align: left; }
  th { background: #eee; }
</style></head><body>
<h2>Purchase Order - ${escapeHtml(title)}</h2>
<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>
</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const columns = useMemo<ColumnDef<PurchaseOrderListItem, any>[]>(
    () => [
      {
        header: 'Next',
        accessorKey: 'nextDate',
        enableColumnFilter: false,
        cell: (info) => showDate(info.row.original.nextDate),
      },
      {
        header: 'Amount($)',
        accessorKey: 'amount',
        enableColumnFilter: false,
        cell: (info) => showAmount(info.row.original.amount),
      },
      {
        header: 'Vendor',
        accessorKey: 'vendor',
        enableColumnFilter: false,
        cell: (info) => (
          <span style={{ fontWeight: 500 }}>{info.row.original.vendor || '-'}</span>
        ),
      },
      {
        header: 'Payment Frequency',
        accessorKey: 'paymentFrequency',
        enableColumnFilter: false,
        cell: (info) => info.row.original.paymentFrequency || '-',
      },
      {
        header: 'PO Type',
        accessorKey: 'poType',
        enableColumnFilter: false,
        cell: (info) => info.row.original.poType || '-',
      },
      {
        header: 'Code',
        accessorKey: 'code',
        enableColumnFilter: false,
        cell: (info) => info.row.original.code || '-',
      },
      {
        header: 'Account No',
        accessorKey: 'accountNo',
        enableColumnFilter: false,
        cell: (info) => showAccountNo(info.row.original.accountNo),
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
                to={`/area/purchaseorder/edit/${id}`}
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
            <h1 className="page-title-main">Purchase Order</h1>
          </div>
        </div>
        <TableContainer
          columns={columns}
          data={list || []}
          isGlobalFilter={true}
          isColumnFilter={false}
          searchPlaceholder="Search purchase order..."
          searchAddLayout={true}
          isAddButton={true}
          buttonName="+ Add"
          handleUserClick={() => navigate('/area/purchaseorder/create')}
          customCenterHeader={
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {VIEWS.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  className={`btn btn-sm ${view === v.key ? 'btn-primary' : 'btn-outline-primary'}`}
                  disabled={loading}
                  onClick={() => loadList(v.key)}
                >
                  {v.label}
                </button>
              ))}
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={handlePrint}
              >
                <i className="mdi mdi-printer-outline me-1"></i>Print
              </button>
            </div>
          }
          isPagination={true}
          isCustomPageSize={true}
          isLoading={loading}
          emptyMessage="No purchase orders found."
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

export default PurchaseOrderList;
