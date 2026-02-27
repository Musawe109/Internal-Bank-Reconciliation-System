/**
 * Transaction list component for reconciliation detail view.
 */

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  reference: string;
}

interface TransactionListProps {
  title: string;
  transactions: Transaction[];
  highlight?: boolean;
}

export default function TransactionList({ title, transactions, highlight = false }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`rounded-lg p-6 ${highlight ? 'bg-blue-50' : 'bg-white'} shadow`}>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      
      {transactions.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No transactions</p>
      ) : (
        <div className="mt-4 overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Reference</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">{formatDate(tx.date)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{tx.reference}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{tx.description}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
