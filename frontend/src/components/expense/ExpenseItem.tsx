import Badge from '@/components/ui/Badge';

const categoryIcons: { [key: string]: string } = {
  food: '🍽️',
  transport: '🚗',
  entertainment: '🎮',
  shopping: '🛍️',
  health: '🏥',
  housing: '🏠',
  utilities: '⚡',
  insurance: '🛡️',
  subscriptions: '📱',
  other: '📦',
};

const categoryColors: { [key: string]: string } = {
  food: 'from-orange-500 to-red-500',
  transport: 'from-blue-500 to-indigo-500',
  entertainment: 'from-purple-500 to-pink-500',
  shopping: 'from-pink-500 to-rose-500',
  health: 'from-green-500 to-emerald-500',
  housing: 'from-yellow-500 to-orange-500',
  utilities: 'from-cyan-500 to-blue-500',
  insurance: 'from-indigo-500 to-purple-500',
  subscriptions: 'from-violet-500 to-purple-500',
  other: 'from-gray-500 to-slate-500',
};

export default function ExpenseItem({ expense }: { expense: any }) {
  const categoryIcon = categoryIcons[expense.category] || '📦';
  const categoryColor = categoryColors[expense.category] || 'from-gray-500 to-slate-500';

  return (
    <div className='glass p-4 sm:p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center space-x-4'>
          <div
            className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${categoryColor} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}
          >
            {categoryIcon}
          </div>

          <div className='space-y-1 overflow-hidden'>
            <h3 className='text-lg font-semibold text-white group-hover:text-gray-200 transition-colors truncate'>{expense.name}</h3>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
              <span className='text-sm text-gray-400'>
                {new Date(expense.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              {expense.category && (
                <Badge variant='info' size='sm'>
                  {expense.category}
                </Badge>
              )}
              {expense.frequency && (
                <Badge variant='warning' size='sm'>
                  {expense.frequency === 'monthly' ? 'Mensuel' : 'Annuel'}
                </Badge>
              )}
            </div>
            {expense.description && <p className='text-sm text-gray-500 truncate'>{expense.description}</p>}
          </div>
        </div>

        <div className='self-end sm:self-center text-right'>
          <div className='text-xl sm:text-2xl font-bold text-red-400 group-hover:text-red-300 transition-colors'>– {expense.amount.toFixed(2)} €</div>
        </div>
      </div>
    </div>
  );
}
