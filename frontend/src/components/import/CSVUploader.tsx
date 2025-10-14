'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { importCSV } from '@/services/import'
import { ImportResult } from '@/types/import'
import Button from '@/components/ui/Button'
import { handleSilentError } from '@/lib/errorHandler'

interface CSVUploaderProps {
  onSuccess?: () => void
}

export default function CSVUploader({ onSuccess }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    // Vérifier le type de fichier
    if (!file.name.endsWith('.csv')) {
      toast.error('Type de fichier invalide', {
        description: 'Veuillez sélectionner un fichier CSV (.csv)',
      })
      return
    }

    setIsUploading(true)
    setResult(null)

    try {
      const importResult = await importCSV(file)
      setResult(importResult)

      if (importResult.success) {
        toast.success('Import réussi !', {
          description: `${importResult.expenses_created} dépenses et ${importResult.incomes_created} revenus importés`,
        })
        onSuccess?.()
      } else {
        toast.warning('Import terminé avec des erreurs', {
          description: `Consultez les détails ci-dessous`,
        })
      }
    } catch (error: any) {
      handleSilentError(error)
      toast.error('Erreur lors de l\'import', {
        description: error.response?.data?.detail || 'Une erreur est survenue',
      })
    } finally {
      setIsUploading(false)
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      {/* Zone de drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]'
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          {/* Icône */}
          <div className={`
            p-4 rounded-full transition-all duration-300
            ${isDragging ? 'bg-indigo-500/20' : 'bg-gray-700/50'}
          `}>
            <svg
              className={`w-12 h-12 transition-colors duration-300 ${isDragging ? 'text-indigo-400' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Texte */}
          <div>
            <p className="text-lg font-semibold text-white mb-2">
              {isUploading ? 'Import en cours...' : 'Glissez-déposez votre fichier CSV ici'}
            </p>
            <p className="text-sm text-gray-400">
              ou cliquez pour sélectionner un fichier
            </p>
          </div>

          {/* Bouton */}
          {!isUploading && (
            <Button variant="outline" size="md" type="button">
              Sélectionner un fichier
            </Button>
          )}

          {isUploading && (
            <div className="flex items-center space-x-2 text-indigo-400">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Traitement du fichier...</span>
            </div>
          )}
        </div>
      </div>

      {/* Résultats */}
      {result && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <svg className={`w-6 h-6 mr-2 ${result.success ? 'text-green-400' : 'text-yellow-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={result.success ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'} />
            </svg>
            Résultat de l'import
          </h3>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{result.total_transactions}</p>
              <p className="text-sm text-gray-400">Transactions</p>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 text-center border border-green-500/20">
              <p className="text-2xl font-bold text-green-400">{result.expenses_created}</p>
              <p className="text-sm text-gray-400">Dépenses</p>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 text-center border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-400">{result.incomes_created}</p>
              <p className="text-sm text-gray-400">Revenus</p>
            </div>
            <div className="bg-yellow-500/10 rounded-xl p-4 text-center border border-yellow-500/20">
              <p className="text-2xl font-bold text-yellow-400">{result.skipped}</p>
              <p className="text-sm text-gray-400">Ignorées</p>
            </div>
          </div>

          {/* Erreurs */}
          {result.errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <h4 className="text-red-400 font-semibold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Erreurs ({result.errors.length})
              </h4>
              <ul className="space-y-1 text-sm text-gray-300 max-h-40 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-400 mr-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Informations */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Format attendu
        </h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Fichier CSV avec séparateur point-virgule (;)</li>
          <li>• Colonnes: dateOp, dateVal, label, category, amount, etc.</li>
          <li>• Montants négatifs pour les dépenses, positifs pour les revenus</li>
          <li>• Les doublons sont automatiquement détectés et ignorés</li>
        </ul>
      </div>
    </div>
  )
}
