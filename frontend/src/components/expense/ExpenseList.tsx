import ExpenseItem from './ExpenseItem';

export default function ExpenseList({ expenses }: { expenses: any[] }) {
  if (expenses.length === 0) {
    return <p className='text-gray-500'>Aucune dépense enregistrée.</p>;
  }

  return (
    <ul className='space-y-3'>
      {expenses.map((exp) => (
        <ExpenseItem key={exp.id} expense={exp} />
      ))}
    </ul>
  );
}
