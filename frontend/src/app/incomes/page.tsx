'use client';

import { useState } from 'react';
import { useIncomes } from '@/hooks/useIncomes';
import IncomeList from '@/components/income/IncomeList';
import IncomeModal from '@/components/income/IncomeModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorNotification from '@/components/ErrorNotification';
import { Income } from '@/types/income';
import Button from '@/components/ui/Button';

export default function IncomesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const { incomes, categories, frequencies, loading, error, createIncome, updateIncome, deleteIncome, loadIncomes } = useIncomes();

  const handleAddIncome = async (incomeData: any) => {
    try {
      await createIncome(incomeData);
      // La liste sera automatiquement rafraîchie grâce au hook
    } catch (error) {
      console.error('Erreur lors de la création du revenu:', error);
      throw error; // Re-lancer l'erreur pour que le modal puisse l'afficher
    }
  };

  const handleDeleteIncome = async (incomeId: string) => {
    try {
      await deleteIncome(incomeId);
      // La liste sera automatiquement rafraîchie grâce au hook
    } catch (error) {
      console.error('Erreur lors de la suppression du revenu:', error);
    }
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setIsModalOpen(true);
  };

  const handleUpdateIncome = async (incomeId: string, incomeData: any) => {
    try {
      await updateIncome(incomeId, incomeData);
      // La liste sera automatiquement rafraîchie grâce au hook
    } catch (error) {
      console.error('Erreur lors de la modification du revenu:', error);
      throw error; // Re-lancer l'erreur pour que le modal puisse l'afficher
    }
  };

  const handleOpenAddModal = () => {
    setEditingIncome(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='glass-card p-8 rounded-2xl'>
          <div className='flex items-center space-x-4'>
            <div className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin'></div>
            <span className='text-white text-lg'>Chargement des revenus...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        {/* Notification d'erreur */}
        <ErrorNotification error={error} />

        <div className='container mx-auto px-4 py-8'>
          {/* Header avec bouton d'ajout */}
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='text-3xl font-bold text-white mb-2'>Mes revenus</h1>
              <p className='text-gray-400'>Gérez et suivez vos revenus en temps réel</p>
            </div>
            <Button onClick={handleOpenAddModal} className='flex items-center space-x-2'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
              <span>Nouveau revenu</span>
            </Button>
          </div>

          {/* Liste des revenus */}
          <div className='glass-card p-6 rounded-2xl'>
            <IncomeList incomes={incomes} onDelete={handleDeleteIncome} onEdit={handleEditIncome} />
          </div>
        </div>

        {/* Modal unifié pour ajout et édition */}
        <IncomeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          income={editingIncome}
          onAdd={handleAddIncome}
          onUpdate={handleUpdateIncome}
          categories={categories}
          frequencies={frequencies}
          loading={false}
        />
      </div>
    </ProtectedRoute>
  );
}
