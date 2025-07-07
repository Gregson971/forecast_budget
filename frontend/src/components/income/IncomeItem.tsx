import { useState } from 'react';
import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/ui/ConfirmModal';

const categoryIcons: { [key: string]: string } = {
  salary: '💰',
  freelance: '💼',
  investment: '📈',
  rental: '🏠',
  business: '🏢',
  bonus: '🎁',
  commission: '💸',
  royalties: '📚',
  pension: '👴',
  other: '💵',
};

const categoryColors: { [key: string]: string } = {
  salary: 'from-green-500 to-emerald-500',
  freelance: 'from-blue-500 to-indigo-500',
  investment: 'from-purple-500 to-pink-500',
  rental: 'from-yellow-500 to-orange-500',
  business: 'from-cyan-500 to-blue-500',
  bonus: 'from-pink-500 to-rose-500',
  commission: 'from-indigo-500 to-purple-500',
  royalties: 'from-violet-500 to-purple-500',
  pension: 'from-gray-500 to-slate-500',
  other: 'from-green-400 to-teal-500',
};

export default function IncomeItem({ income, onDelete, onEdit }: { income: any; onDelete?: (id: string) => void; onEdit?: (income: any) => void }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const categoryIcon = categoryIcons[income.category] || '💵';
  const categoryColor = categoryColors[income.category] || 'from-green-400 to-teal-500';

  const handleDelete = () => {
    if (onDelete) {
      onDelete(income.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(income);
    }
  };

  return (
    <>
      <div className='glass p-4 sm:p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center space-x-4'>
            <div
              className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${categoryColor} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}
            >
              {categoryIcon}
            </div>

            <div className='space-y-1 overflow-hidden'>
              <h3 className='text-lg font-semibold text-white group-hover:text-gray-200 transition-colors truncate'>{income.name}</h3>
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                <span className='text-sm text-gray-400'>
                  {new Date(income.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {income.category && (
                  <Badge variant='info' size='sm'>
                    {income.category}
                  </Badge>
                )}
                {income.frequency && (
                  <Badge variant='warning' size='sm'>
                    {income.frequency}
                  </Badge>
                )}
              </div>
              {income.description && <p className='text-sm text-gray-500 truncate'>{income.description}</p>}
            </div>
          </div>

          <div className='self-end sm:self-center text-right flex items-center gap-3'>
            <div className='text-xl sm:text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors'>+ {income.amount.toFixed(2)} €</div>
            <div className='flex items-center gap-2'>
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className='p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200 group/edit'
                  title='Modifier ce revenu'
                >
                  <svg className='w-5 h-5 group-hover/edit:scale-110 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className='p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 group/delete'
                  title='Supprimer ce revenu'
                >
                  <svg className='w-5 h-5 group-hover/delete:scale-110 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title='Supprimer le revenu'
        message={`Êtes-vous sûr de vouloir supprimer le revenu "${income.name}" ? Cette action est irréversible.`}
        confirmText='Supprimer'
        cancelText='Annuler'
        variant='danger'
      />
    </>
  );
}
