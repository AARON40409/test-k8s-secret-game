export enum StatutMessage {
    DATA_EXIST = 'Donnée existante ',
    DATA_NOT_EXIST = 'Donnée inexistante ',
    LOGIN_FAILED = 'Login et/ou password incorrect ',
    INCORRECT_OTP = 'Code otp incorrect',
    INCORRECT_TOKEN = 'Token incorrect ou a expiré',
    LOCKED_ACCOUNT = 'Compte bloqué',
    UNLOCKED_ACCOUNT = 'Compte deja débloqué',
    SUCCESS = 'Opération éffectuée avec success ',
    DISALLOWED_OPERATION = 'Opération interdite ',
    FIRST_CONNECTION = 'Prière de changer votre mot de passe par défaut',
    DEFAULT_PASSWORD = "Le mot de passe doit être différent de l'ancien",
    OBSOLETE_PASSWORD = 'Le mot de passe a expiré',
    PASSWORD_MATCHES_PREVIOUS = 'Le mot de passe être différent des trois derniers mot de passe ',
    ERREUR_INTERNE = "Un problème est survenu durant l'opération ",
    INSERTION_ERROR = 'Une erreur est subvenu lors de la creation',
    NOT_AUTHORIZED = "Vous n'etes pas autorisé a acceder a cette route",
  }
  