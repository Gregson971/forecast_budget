'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import FinancialForm from './FinancialForm';
import { BaseFinancialItem, BaseFinancialRequest, Category, Frequency } from '@/types/financial';

interface FinancialModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: BaseFinancialItem | null; // null = mode création, BaseFinancialItem = mode édition
  onAdd?: (item: BaseFinancialRequest) => Promise<void>;
  onUpdate?: (itemId: string, item: BaseFinancialRequest) => Promise<void>;
  categories: Category[];
  frequencies: Frequency[];
  loading?: boolean;
  type: 'expense' | 'income';
}

export default function FinancialModal({ isOpen, onClose, item, onAdd, onUpdate, categories, frequencies, loading = false, type = 'expense' }: FinancialModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!item;

  const handleAdd = async (itemData: BaseFinancialRequest) => {
    setIsSubmitting(true);
    try {
      if (onAdd) {
        await onAdd(itemData);
        onClose();
      }
    } catch (error) {
      // L'erreur sera gérée par le formulaire
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (itemId: string, itemData: BaseFinancialRequest) => {
    setIsSubmitting(true);
    try {
      if (onUpdate) {
        await onUpdate(itemId, itemData);
        onClose();
      }
    } catch (error) {
      // L'erreur sera gérée par le formulaire
      console.error('Erreur lors de la modification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    const typeLabel = type === 'expense' ? 'dépense' : 'revenu';
    return isEditMode ? `Modifier la ${typeLabel}` : `Nouvelle ${typeLabel}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} size='md'>
      <FinancialForm
        item={item}
        onAdd={!isEditMode ? handleAdd : undefined}
        onUpdate={isEditMode ? handleUpdate : undefined}
        categories={categories}
        frequencies={frequencies}
        loadingData={false}
        dataError={null}
        loading={isSubmitting || loading}
        type={type}
      />
    </Modal>
  );
}
