/**
 * Service pour l'import de transactions depuis un fichier CSV
 */

import api from '@/lib/api'
import { ImportResult } from '@/types/import'

/**
 * Importe des transactions depuis un fichier CSV
 * @param file - Fichier CSV à importer
 * @returns Résultat de l'import
 */
export const importCSV = async (file: File): Promise<ImportResult> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<ImportResult>('/imports/csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
