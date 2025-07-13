import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import 'reflect-metadata';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as swaggerStats from 'swagger-stats';
import * as swaggerUi from 'swagger-ui-express';
import {createConnection} from 'typeorm';
import routes from './routes';

// Load environment variables
dotenv.config();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Bank API',
      version: '1.0.0',
      description: 'API for the Student Banking Application',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./build/routes/**/*.js'],
};

const specs = swaggerJSDoc(options);
// Connects to the Database -> then starts the express
createConnection()
  .then(() => {
    // Create a new express application instance

    // Call midlewares
    const app = express();
    
    // CORS configuration with environment variables
    const corsOptions = {
      origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
      credentials: true,
      optionsSuccessStatus: 200
    };
    
    app.use(cors(corsOptions));
    app.use(swaggerStats.getMiddleware({}));
    app.use(helmet());
    app.use(bodyParser.json());
    morgan.token('header-auth', (req, res) => req.headers.auth);
    morgan.token('body', (req, res) => req.body.toString());
    app.use(morgan('[:date[web]] Started :method :url for :remote-addr', true));
    app.use(morgan('[:date[web]] Started with token :header-auth', true));
    app.use(morgan('[:date[web]] Started with body :body', true));
    app.use(
      morgan(
        '[:date[iso]] Completed :status :res[content-length] in :response-time ms',
      ),
    );

    // Welcome page for the backend
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Student Bank API</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: auto; max-width: 38rem; padding: 2rem; background-color: #f4f7f9; }
                .container { background-color: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                .status { padding: 10px; border-radius: 5px; font-weight: bold; }
                .status.ok { background-color: #e0f2e9; color: #2d6a4f; }
                ul { list-style: none; padding: 0; }
                li { margin-bottom: 1rem; }
                a { color: #007bff; text-decoration: none; font-weight: bold; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Student Bank API</h1>
                <p>Welcome to the backend API for the Student Banking Application.</p>
                <div class="status ok">
                    API Status: Operational
                </div>
                <h3>Available Resources:</h3>
                <ul>
                    <li><a href="http://localhost:3001" target="_blank">Go to Frontend Application</a></li>
                    <li><a href="/api-docs" target="_blank">View API Documentation (Swagger)</a></li>
                    <li><a href="/health" target="_blank">Check API Health</a></li>
                </ul>
            </div>
        </body>
        </html>
      `);
    });

    // Health check endpoint
    app.get(process.env.HEALTH_CHECK_PATH || '/health', (req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });
    
    // Set all routes from routes folder
    app.use('/api', routes);
    
    // Swagger documentation (only if enabled)
    if (process.env.SWAGGER_ENABLED === 'true') {
      app.use(process.env.SWAGGER_PATH || '/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }
    
    // Start server with environment variables
    const port = parseInt(process.env.API_PORT || '3000');
    const host = process.env.API_HOST || '0.0.0.0';
    
    app.listen(port, host, async () => {
      console.log(`Server started on ${host}:${port}`);
      console.log(`API Documentation: http://${host}:${port}${process.env.SWAGGER_PATH || '/api-docs'}`);
      console.log(`Health Check: http://${host}:${port}${process.env.HEALTH_CHECK_PATH || '/health'}`);
    });
  })
  .catch(e => console.log(e));
