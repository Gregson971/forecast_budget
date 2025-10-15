import TransactionsClientWrapper from '@/components/wrappers/TransactionsClientWrapper';

export default function TransactionsPage() {
  return (
    <div className='page-container'>
      <div className='max-w-7xl mx-auto'>
        {/* Header - Server Component (static content) */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold text-white mb-2'>Transactions</h1>
              <p className='text-gray-400'>Gérez vos dépenses et revenus en un seul endroit</p>
            </div>
          </div>
        </div>

        {/* Client Component - Interactive content */}
        <TransactionsClientWrapper />
      </div>
    </div>
  );
}
