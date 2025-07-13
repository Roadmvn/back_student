-- Script d'initialisation de la base de données
-- Ce script sera exécuté au premier démarrage du conteneur MySQL

USE dev_db;
 
-- Création de l'utilisateur admin par défaut (sera fait par TypeORM mais on s'assure que la DB est prête)
SELECT 'Base de données dev_db initialisée avec succès!' as message; 