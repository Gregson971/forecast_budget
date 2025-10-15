import AccountClientWrapper from '@/components/wrappers/AccountClientWrapper';

export default function AccountPage() {
  return (
    <div className='page-container'>
      <div className='container mx-auto max-w-4xl'>
        {/* Header - Server Component (static content) */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>Paramètres du compte</h1>
          <p className='text-muted-foreground'>Gérez les informations de votre compte</p>
        </div>

        {/* Client Component - Interactive content */}
        <AccountClientWrapper />
      </div>
    </div>
  );
}
