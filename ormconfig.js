module.exports ={
   type: "mysql",
   host: process.env.DB_HOST || "localhost",
   port: parseInt(process.env.DB_PORT || "3306"),
   username: process.env.DB_USERNAME || "root",
   password: process.env.DB_PASSWORD || "root",
   database: process.env.DB_DATABASE || "dev_db",
   synchronize: true,
   logging: false,
   migrationsRun: true,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
};
