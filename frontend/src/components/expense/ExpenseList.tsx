import ExpenseItem from './ExpenseItem';

export default function ExpenseList({ expenses }: { expenses: any[] }) {
  if (expenses.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4'>
          <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
        </div>
        <h3 className='text-xl font-semibold text-white mb-2'>Aucune dépense</h3>
        <p className='text-gray-400'>Commencez par ajouter votre première dépense</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-white'>Liste des dépenses</h2>
        <div className='flex items-center space-x-2'>
          <span className='text-gray-400'>Total:</span>
          <span className='text-xl font-bold text-white'>{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}€</span>
        </div>
      </div>

      <div className='space-y-3'>
        {expenses.map((exp) => (
          <ExpenseItem key={exp.id} expense={exp} />
        ))}
      </div>
    </div>
  );
}
