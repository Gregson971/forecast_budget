import ForecastsClientWrapper from '@/components/wrappers/ForecastsClientWrapper';

export default function ForecastsPage() {
  return (
    <div className='page-container'>
      <div className='max-w-7xl mx-auto'>
        {/* Header - Server Component (static content) */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-4'>Prévisions financières</h1>
          <p className='text-muted-foreground mb-6'>
            Visualisez vos dépenses, revenus et prévisions sur différentes périodes.
          </p>
        </div>

        {/* Client Component - Interactive content */}
        <ForecastsClientWrapper />
      </div>
    </div>
  );
}
