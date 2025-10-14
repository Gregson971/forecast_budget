import { toast } from 'sonner'
import { AxiosError } from 'axios'

/**
 * Types d'erreurs gérées par l'application
 */
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

/**
 * Configuration de l'erreur
 */
interface ErrorConfig {
  showToast?: boolean
  logToConsole?: boolean
  customMessage?: string
}

/**
 * Informations extraites d'une erreur
 */
interface ErrorInfo {
  type: ErrorType
  message: string
  details?: string
  statusCode?: number
}

/**
 * Extrait les informations d'une erreur Axios
 */
const extractErrorInfo = (error: unknown): ErrorInfo => {
  // Erreur Axios
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status
    const errorData = error.response?.data

    // Erreur réseau
    if (!error.response) {
      return {
        type: ErrorType.NETWORK,
        message: 'Impossible de se connecter au serveur',
        details: 'Vérifiez votre connexion internet ou contactez le support',
      }
    }

    // Erreur d'authentification
    if (statusCode === 401) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: 'Session expirée',
        details: 'Veuillez vous reconnecter',
        statusCode,
      }
    }

    // Erreur de validation
    if (statusCode === 400 || statusCode === 422) {
      return {
        type: ErrorType.VALIDATION,
        message: errorData?.detail || 'Données invalides',
        details: typeof errorData?.detail === 'string' ? errorData.detail : undefined,
        statusCode,
      }
    }

    // Erreur serveur
    if (statusCode && statusCode >= 500) {
      return {
        type: ErrorType.SERVER,
        message: 'Erreur du serveur',
        details: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
        statusCode,
      }
    }

    // Autres erreurs HTTP
    return {
      type: ErrorType.UNKNOWN,
      message: errorData?.detail || error.message || 'Une erreur est survenue',
      statusCode,
    }
  }

  // Erreur JavaScript standard
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
    }
  }

  // Erreur inconnue
  return {
    type: ErrorType.UNKNOWN,
    message: 'Une erreur inconnue est survenue',
  }
}

/**
 * Gestionnaire d'erreurs centralisé
 *
 * @param error - L'erreur à traiter
 * @param config - Configuration optionnelle
 * @returns Les informations de l'erreur
 */
export const handleError = (
  error: unknown,
  config: ErrorConfig = {}
): ErrorInfo => {
  const {
    showToast = true,
    logToConsole = process.env.NODE_ENV === 'development',
    customMessage,
  } = config

  const errorInfo = extractErrorInfo(error)

  // Log en console (seulement en développement par défaut)
  if (logToConsole) {
    const emoji = {
      [ErrorType.NETWORK]: '🌐',
      [ErrorType.AUTHENTICATION]: '🔐',
      [ErrorType.VALIDATION]: '⚠️',
      [ErrorType.SERVER]: '🔥',
      [ErrorType.UNKNOWN]: '❓',
    }[errorInfo.type]

    console.group(`${emoji} ${errorInfo.type.toUpperCase()} Error`)
    console.error('Message:', errorInfo.message)
    if (errorInfo.details) console.error('Details:', errorInfo.details)
    if (errorInfo.statusCode) console.error('Status:', errorInfo.statusCode)
    if (error instanceof AxiosError) {
      console.error('URL:', error.config?.url)
      console.error('Method:', error.config?.method?.toUpperCase())
    }
    console.error('Raw error:', error)
    console.groupEnd()
  }

  // Afficher un toast à l'utilisateur
  if (showToast) {
    const message = customMessage || errorInfo.message

    // Ne pas afficher de toast pour les erreurs d'authentification
    // (la redirection vers login suffit)
    if (errorInfo.type !== ErrorType.AUTHENTICATION) {
      toast.error(message, {
        description: errorInfo.details,
        duration: 5000,
      })
    }
  }

  return errorInfo
}

/**
 * Gestionnaire d'erreurs spécifique pour les opérations CRUD
 */
export const handleCrudError = (
  operation: 'create' | 'read' | 'update' | 'delete',
  entity: string,
  error: unknown
) => {
  const operationLabels = {
    create: 'création',
    read: 'récupération',
    update: 'modification',
    delete: 'suppression',
  }

  return handleError(error, {
    customMessage: `Erreur lors de la ${operationLabels[operation]} de ${entity}`,
  })
}

/**
 * Gestionnaire d'erreurs silencieux (pas de toast, seulement log)
 */
export const handleSilentError = (error: unknown) => {
  return handleError(error, {
    showToast: false,
  })
}

/**
 * Vérifie si une erreur est de type spécifique
 */
export const isErrorType = (error: unknown, type: ErrorType): boolean => {
  const errorInfo = extractErrorInfo(error)
  return errorInfo.type === type
}
