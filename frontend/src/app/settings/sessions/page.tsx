import SessionsClientWrapper from '@/components/wrappers/SessionsClientWrapper';

export default function SessionsPage() {
  return (
    <div className='page-container'>
      <div className='container mx-auto max-w-7xl'>
        {/* Header - Server Component (static content) */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>Sessions actives</h1>
          <p className='text-muted-foreground'>Gérez vos sessions de connexion</p>
        </div>

        {/* Client Component - Interactive content */}
        <SessionsClientWrapper />
      </div>
    </div>
  );
}
