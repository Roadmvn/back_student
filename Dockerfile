FROM node:18-alpine

# Installer netcat pour les tests de connectivité
RUN apk add --no-cache netcat-openbsd

# Créer le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (dev incluses pour TypeScript)
RUN npm install

# Copier le code source
COPY . .

# Compiler TypeScript
RUN npm run tsc

# Exposer le port
EXPOSE 3000

# Créer un script de démarrage
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Démarrer l'application
ENTRYPOINT ["docker-entrypoint.sh"]
