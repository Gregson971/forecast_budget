"""Parser pour les fichiers CSV bancaires."""

import csv
from datetime import datetime
from typing import List
from io import StringIO

from app.domain.entities.import_result import ImportedTransaction


class BankCSVParser:
    """Parser pour les fichiers CSV d'exports bancaires."""

    # Mots-clés pour détecter les transactions récurrentes
    RECURRING_KEYWORDS = [
        "PRLV SEPA",
        "PRLV",
        "PRELEVEMENT",
        "ABONNEMENT",
        "VIR SEPA",
        "VIR INST",
    ]

    # Mapping des catégories bancaires vers nos catégories
    CATEGORY_MAPPING = {
        "Alimentation": "Alimentation",
        "Restaurants, bars, discothèques…": "Restaurants",
        "Transports quotidiens (métro, bus…)": "Transport",
        "Carburant": "Carburant",
        "Téléphonie (fixe et mobile)": "Téléphonie",
        "Multimedia à domicile (TV, internet, téléphonie…)": "Abonnements",
        "Crédit conso": "Crédit",
        "Complémentaires santé": "Santé",
        "Assurances (Auto/Moto)": "Assurance",
        "Divertissement - culture (ciné, théâtre, concerts…)": "Loisirs",
        "Electronique et informatique": "Electronique",
        "Bricolage et jardinage": "Bricolage",
        "Club / association (sport, hobby, art…)": "Sport",
        "Etudes (formation, fournitures, cantines…)": "Education",
        "Frais bancaires et de gestion (dont agios)": "Frais bancaires",
        "Livres, CD/DVD, bijoux, jouets…": "Shopping",
        "Mobilier, électroménager, décoration…": "Equipement maison",
        "Dépenses Jeux et paris": "Jeux",
        "Epargne financière (retraite, prévoyance, PEA, assurance-vie…)": "Epargne",
        "Vie Quotidienne - Autres": "Autres",
        "Non catégorisé": "Autres",
    }

    def parse(self, file_content: str) -> List[ImportedTransaction]:
        """
        Parse un fichier CSV et retourne une liste de transactions importées.

        Args:
            file_content: Contenu du fichier CSV en string

        Returns:
            Liste de ImportedTransaction
        """
        transactions = []

        # Enlever le BOM UTF-8 si présent
        if file_content.startswith('\ufeff'):
            file_content = file_content[1:]

        # Parser le CSV avec point-virgule comme délimiteur
        csv_reader = csv.DictReader(StringIO(file_content), delimiter=';')

        for row in csv_reader:
            try:
                # Ignorer les lignes vides
                if not row.get('dateOp') or not row.get('amount'):
                    continue

                transaction = self._parse_row(row)
                if transaction:
                    transactions.append(transaction)

            except Exception as e:
                # Log l'erreur mais continue le parsing
                print(f"Erreur lors du parsing de la ligne: {e}")
                continue

        return transactions

    def _parse_row(self, row: dict) -> ImportedTransaction:
        """Parse une ligne du CSV en ImportedTransaction."""

        # Parser la date (utiliser dateVal comme date de valeur)
        date_str = row.get('dateVal') or row.get('dateOp')
        date = datetime.strptime(date_str, '%Y-%m-%d')

        # Parser le montant (format français: virgule comme séparateur décimal)
        amount_str = row.get('amount', '0').replace(' ', '').replace('"', '')
        # Remplacer la virgule par un point pour la conversion
        amount_str = amount_str.replace(',', '.')
        amount = float(amount_str)

        # Déterminer si c'est une dépense ou un revenu
        is_expense = amount < 0

        # Valeur absolue du montant pour les dépenses
        amount = abs(amount)

        # Description
        description = row.get('label', '').strip('"')

        # Catégorie
        category_raw = row.get('category', '').strip('"')
        category = self.CATEGORY_MAPPING.get(category_raw, category_raw or "Autres")

        # Catégorie parente
        category_parent = row.get('categoryParent', '').strip('"')

        # Fournisseur
        supplier = row.get('supplierFound', '').strip('"')

        # Détecter si la transaction est récurrente
        is_recurring = self._is_recurring(description)

        # Compte
        account_label = row.get('accountLabel', '').strip('"')

        return ImportedTransaction(
            date=date,
            description=description,
            amount=amount,
            category=category,
            category_parent=category_parent,
            supplier=supplier,
            is_expense=is_expense,
            is_recurring=is_recurring,
            account_label=account_label,
        )

    def _is_recurring(self, description: str) -> bool:
        """Détermine si une transaction est récurrente basé sur sa description."""
        description_upper = description.upper()
        return any(keyword in description_upper for keyword in self.RECURRING_KEYWORDS)
