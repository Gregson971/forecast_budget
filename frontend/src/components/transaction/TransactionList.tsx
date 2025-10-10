import { useState, useMemo } from 'react';
import TransactionItem from './TransactionItem';
import { Transaction, filterTransactions, sortTransactionsByDate } from '@/types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string, type: 'expense' | 'income') => void;
  onEdit?: (transaction: Transaction) => void;
}

const ITEMS_PER_PAGE = 20;

export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Extraire les années et mois disponibles
  const availableYears = useMemo(() => {
    const years = new Set(transactions.map(t => new Date(t.date).getFullYear().toString()));
    return ['all', ...Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))];
  }, [transactions]);

  const availableMonths = useMemo(() => {
    return ['all', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  }, []);

  // Filtrer par type, mois et année
  const filteredTransactions = useMemo(() => {
    let filtered = filterTransactions(transactions, filter);

    if (selectedYear !== 'all') {
      filtered = filtered.filter(t => new Date(t.date).getFullYear().toString() === selectedYear);
    }

    if (selectedMonth !== 'all') {
      filtered = filtered.filter(t => {
        const month = (new Date(t.date).getMonth() + 1).toString().padStart(2, '0');
        return month === selectedMonth;
      });
    }

    return sortTransactionsByDate(filtered);
  }, [transactions, filter, selectedYear, selectedMonth]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Calculer les totaux (sur les transactions filtrées)
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalIncomes = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncomes - totalExpenses;

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filter, selectedMonth, selectedYear]);

  const handleDelete = (id: string) => {
    if (onDelete) {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        onDelete(id, transaction.type);
      }
    }
  };

  if (transactions.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4'>
          <svg className='w-8 h-8 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
        </div>
        <h3 className='text-xl font-semibold text-white mb-2'>Aucune transaction</h3>
        <p className='text-gray-400'>Commencez par ajouter une transaction ou importer un fichier CSV</p>
      </div>
    );
  }

  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  return (
    <div className='space-y-6'>
      {/* Filtres par type */}
      <div className='glass p-4 rounded-lg elevation-1'>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded font-medium transition-all ripple ${
              filter === 'all'
                ? 'bg-blue-500 text-white elevation-2'
                : 'bg-secondary text-gray-300 hover:bg-muted'
            }`}
          >
            Tout ({transactions.length})
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded font-medium transition-all ripple ${
              filter === 'expense'
                ? 'bg-red-500 text-white elevation-2'
                : 'bg-secondary text-gray-300 hover:bg-muted'
            }`}
          >
            Dépenses ({transactions.filter(t => t.type === 'expense').length})
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded font-medium transition-all ripple ${
              filter === 'income'
                ? 'bg-green-500 text-white elevation-2'
                : 'bg-secondary text-gray-300 hover:bg-muted'
            }`}
          >
            Revenus ({transactions.filter(t => t.type === 'income').length})
          </button>
        </div>
      </div>

      {/* Filtres par date et statistiques */}
      <div className='glass p-4 rounded-lg elevation-1'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          {/* Filtres temporels */}
          <div className='flex flex-wrap items-center gap-3'>
            <div className='flex items-center gap-2'>
              <label className='text-sm text-gray-400'>Année:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className='px-3 py-1.5 rounded bg-secondary text-white border border-border focus:ring-2 focus:ring-ring focus:outline-none'
              >
                <option value='all'>Toutes</option>
                {availableYears.filter(y => y !== 'all').map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className='flex items-center gap-2'>
              <label className='text-sm text-gray-400'>Mois:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className='px-3 py-1.5 rounded bg-secondary text-white border border-border focus:ring-2 focus:ring-ring focus:outline-none'
              >
                <option value='all'>Tous</option>
                {availableMonths.filter(m => m !== 'all').map((month, idx) => (
                  <option key={month} value={month}>{monthNames[idx]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Statistiques */}
          <div className='flex flex-wrap items-center gap-4 text-sm'>
            <div className='flex items-center space-x-2'>
              <span className='text-muted-foreground'>Dépenses:</span>
              <span className='text-red-400 font-bold'>{totalExpenses.toFixed(2)}€</span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-muted-foreground'>Revenus:</span>
              <span className='text-green-400 font-bold'>{totalIncomes.toFixed(2)}€</span>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='text-muted-foreground'>Solde:</span>
              <span className={`font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {balance >= 0 ? '+' : ''}{balance.toFixed(2)}€
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des transactions */}
      {filteredTransactions.length === 0 ? (
        <div className='text-center py-12 glass p-6 rounded-lg'>
          <p className='text-muted-foreground'>Aucune transaction pour cette sélection</p>
        </div>
      ) : (
        <>
          <div className='space-y-3'>
            {paginatedTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={handleDelete}
                onEdit={onEdit}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='glass p-4 rounded-lg elevation-1'>
              <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                <div className='text-sm text-muted-foreground'>
                  Affichage {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} sur {filteredTransactions.length} transactions
                </div>

                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className='px-3 py-1.5 rounded bg-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all ripple'
                  >
                    Précédent
                  </button>

                  <div className='flex gap-1'>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1.5 rounded transition-all ripple ${
                            currentPage === pageNum
                              ? 'bg-primary text-primary-foreground elevation-2'
                              : 'bg-secondary text-white hover:bg-muted'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className='px-3 py-1.5 rounded bg-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all ripple'
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
