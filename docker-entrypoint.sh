#!/bin/sh

echo "🚀 Démarrage de l'API Backend..."

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
until nc -z db 3306; do
  echo "🔄 Base de données non disponible - attente 2 secondes..."
  sleep 2
done
echo "✅ Base de données prête!"

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
npm run migration:start

# Démarrer l'application
echo "🎯 Démarrage de l'application..."
exec npm start 