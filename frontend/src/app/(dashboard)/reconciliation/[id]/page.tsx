/**
 * Reconciliation detail page - View individual reconciliation item with workflow actions.
 * Full implementation with transaction comparison, variance highlighting, and workflow controls.
 */

'use client';

import { useState, useCallback } from 'react';
import StatusBadge from '@/components/ui/status-badge/StatusBadge';
import ClassificationBadge from '@/components/ui/classification-badge/ClassificationBadge';
import ConfirmationDialog from '@/components/ui/dialog/ConfirmationDialog';
import ManualOverrideModal from '@/components/reconciliation/override/ManualOverrideModal';
import ActionButtons from '@/components/reconciliation/actions/ActionButtons';
import TransactionList from '@/components/reconciliation/detail/TransactionList';
import VarianceHighlight from '@/components/reconciliation/detail/VarianceHighlight';
import ClassificationDropdown from '@/components/reconciliation/classification/ClassificationDropdown';
import { WorkflowState } from '@/lib/enums/workflow-state';
import { ClassificationType } from '@/lib/enums/classification';
import { WorkflowAction } from '@/lib/enums/workflow-action';
import type { ReconciliationItem, BankTransaction, InternalTransaction } from '@/lib/types/reconciliation';

// Mock data - will be replaced with API calls
const mockItem: ReconciliationItem = {
  id: 'item-1',
  transactionDate: new Date('2024-01-15').toISOString(),
  amount: 5000,
  currency: 'USD',
  description: 'Payment for services - Invoice #12345',
  status: WorkflowState.UNMATCHED,
  classification: null,
  bankTransactionId: 'bank-1',
  internalTransactionId: 'internal-1',
  variance: 500,
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-15').toISOString(),
  updatedBy: 'user-1',
};

const mockBankTransaction: BankTransaction = {
  id: 'bank-1',
  date: new Date('2024-01-15').toISOString(),
  amount: 5500,
  description: 'ACH Payment - ABC Corp',
  reference: 'ACH-2024-001',
  accountNumber: '****1234',
};

const mockInternalTransaction: InternalTransaction = {
  id: 'internal-1',
  date: new Date('2024-01-15').toISOString(),
  amount: 5000,
  description: 'Payment for services - Invoice #12345',
  reference: 'INV-12345',
  accountCode: '4000-REV',
  category: 'Revenue',
};

interface ReconciliationDetailPageProps {
  params: { id: string };
}

type DialogType = 'resolve' | 'flag' | 'override' | null;

export default function ReconciliationDetailPage({ params: _params }: ReconciliationDetailPageProps) {
  const [item, setItem] = useState<ReconciliationItem>(mockItem);
  const [bankTransaction] = useState<BankTransaction>(mockBankTransaction);
  const [internalTransaction] = useState<InternalTransaction>(mockInternalTransaction);
  const [classification, setClassification] = useState<ClassificationType | null>(mockItem.classification);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClassificationChange = useCallback(async (newClassification: ClassificationType) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setClassification(newClassification);
    setIsProcessing(false);
  }, []);

  const handleAction = useCallback((action: WorkflowAction) => {
    switch (action) {
      case WorkflowAction.MARK_RESOLVED:
        setDialogType('resolve');
        break;
      case WorkflowAction.FLAG_FOR_REVIEW:
        setDialogType('flag');
        break;
      case WorkflowAction.APPLY_OVERRIDE:
        setIsOverrideModalOpen(true);
        break;
      case WorkflowAction.REVERT:
        // Handle revert directly
        setItem((prev) => ({ ...prev, status: WorkflowState.UNMATCHED }));
        break;
    }
  }, []);

  const handleConfirmAction = useCallback(async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (dialogType === 'resolve') {
      setItem((prev) => ({ ...prev, status: WorkflowState.RESOLVED }));
    } else if (dialogType === 'flag') {
      setItem((prev) => ({ ...prev, status: WorkflowState.FLAGGED }));
    }

    setDialogType(null);
    setIsProcessing(false);
  }, [dialogType]);

  const handleOverrideSubmit = useCallback(async (_data: { reason: string; overrideCode: string }) => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setItem((prev) => ({
      ...prev,
      status: WorkflowState.RESOLVED,
      classification: ClassificationType.MANUAL_OVERRIDE,
    }));

    setIsOverrideModalOpen(false);
    setIsProcessing(false);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogType(null);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDialogConfig = () => {
    switch (dialogType) {
      case 'resolve':
        return {
          title: 'Mark as Resolved?',
          message: 'Are you sure you want to mark this reconciliation item as resolved? This action will be logged in the audit trail.',
          variant: 'info' as const,
          confirmLabel: 'Mark Resolved',
        };
      case 'flag':
        return {
          title: 'Flag for Review?',
          message: 'This item will be flagged for supervisor review. The item will be locked until the review is complete.',
          variant: 'warning' as const,
          confirmLabel: 'Flag Item',
        };
      default:
        return null;
    }
  };

  const dialogConfig = getDialogConfig();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">Reconciliation Item</h1>
            <StatusBadge status={item.status} size="md" />
          </div>
          <p className="mt-1 text-sm text-gray-500">ID: {item.id}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>Last Updated: {formatDate(item.updatedAt)}</div>
          <div>By: {item.updatedBy}</div>
        </div>
      </div>

      {/* Status and Classification Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Status */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-700">Status</h2>
          <div className="mt-2">
            <StatusBadge status={item.status} size="lg" />
          </div>
        </div>

        {/* Classification */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-sm font-medium text-gray-700">Classification</h2>
          <div className="mt-2">
            <ClassificationDropdown
              value={classification}
              onChange={handleClassificationChange}
              disabled={isProcessing}
              isLoading={isProcessing}
            />
          </div>
          {classification && (
            <div className="mt-2">
              <ClassificationBadge classification={classification} size="md" />
            </div>
          )}
        </div>
      </div>

      {/* Variance */}
      <VarianceHighlight variance={item.variance} percentage={(item.variance / item.amount) * 100} />

      {/* Transactions Comparison */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bank Transaction */}
        <TransactionList
          title="Bank Transaction"
          transactions={[
            {
              id: bankTransaction.id,
              date: bankTransaction.date,
              amount: bankTransaction.amount,
              description: bankTransaction.description,
              reference: bankTransaction.reference,
            },
          ]}
          highlight={false}
        />

        {/* Internal Transaction */}
        <TransactionList
          title="Internal Transaction"
          transactions={[
            {
              id: internalTransaction.id,
              date: internalTransaction.date,
              amount: internalTransaction.amount,
              description: internalTransaction.description,
              reference: internalTransaction.reference,
            },
          ]}
          highlight={false}
        />
      </div>

      {/* Variance Details */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Variance Details</h2>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Bank Amount</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(bankTransaction.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Internal Amount</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(internalTransaction.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Difference</p>
            <p className={`text-lg font-semibold ${item.variance !== 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(item.variance)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
        <div className="mt-4">
          <ActionButtons
            status={item.status}
            onAction={handleAction}
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      {dialogConfig && (
        <ConfirmationDialog
          isOpen={dialogType !== null}
          title={dialogConfig.title}
          message={dialogConfig.message}
          variant={dialogConfig.variant}
          confirmLabel={dialogConfig.confirmLabel}
          onConfirm={handleConfirmAction}
          onCancel={handleCloseDialog}
        />
      )}

      {/* Manual Override Modal */}
      <ManualOverrideModal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        onSubmit={handleOverrideSubmit}
        itemId={item.id}
        isLoading={isProcessing}
      />
    </div>
  );
}
