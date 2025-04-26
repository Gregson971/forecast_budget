import SessionList from '@/components/SessionList';

export default function SessionsPage() {
  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-xl font-bold mb-4'>Sessions actives</h1>
      <SessionList />
    </div>
  );
}
