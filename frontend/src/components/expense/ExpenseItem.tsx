export default function ExpenseItem({ expense }: { expense: any }) {
  return (
    <li className='p-4 bg-white rounded-xl shadow-sm border flex justify-between items-center'>
      <div>
        <div className='text-lg font-medium'>{expense.name}</div>
        <div className='text-sm text-gray-500'>{new Date(expense.date).toLocaleDateString()}</div>
      </div>
      <div className='text-right'>
        <div className='text-lg font-bold text-emerald-600'>– {expense.amount} €</div>
      </div>
    </li>
  );
}
