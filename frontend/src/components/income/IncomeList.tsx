import IncomeItem from '@/components/income/IncomeItem';

export default function IncomeList({ incomes, onDelete, onEdit }: { incomes: any[]; onDelete?: (id: string) => void; onEdit?: (income: any) => void }) {
  if (incomes.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4'>
          <svg className='w-8 h-8 text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
            />
          </svg>
        </div>
        <h3 className='text-xl font-semibold text-white mb-2'>Aucun revenu</h3>
        <p className='text-gray-400'>Commencez par ajouter votre premier revenu</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-white'>Liste des revenus</h2>
        <div className='flex items-center space-x-2'>
          <span className='text-gray-400'>Total:</span>
          <span className='text-xl font-bold text-green-400'>{incomes.reduce((sum, inc) => sum + inc.amount, 0).toFixed(2)}€</span>
        </div>
      </div>

      <div className='space-y-3'>
        {incomes.map((inc) => (
          <IncomeItem key={inc.id} income={inc} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}
