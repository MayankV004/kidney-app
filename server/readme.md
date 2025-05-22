# Kidney Health Tracker Backend API

## Overview
A comprehensive REST API for managing kidney health tracking, nutrition monitoring, and meal planning.

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Email**: Nodemailer

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd kidney-health-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
nano .env

# Start the development server
npm run dev
```

### Environment Variables
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kidney-health
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Register a new user
- **POST** `/api/auth/login` - Login user

### User Management
- **GET** `/api/user/profile` - Get user profile
- **PUT** `/api/user/profile` - Update user profile

### Food Management
- **GET** `/api/foods` - Get foods (with search and pagination)
- **POST** `/api/foods` - Create new food item

### Favorites
- **GET** `/api/user/favorites` - Get favorite foods
- **POST** `/api/user/favorites` - Toggle favorite food

### Meals
- **GET** `/api/meals` - Get user meals
- **POST** `/api/meals` - Create new meal
- **PUT** `/api/meals/:id` - Update meal
- **DELETE** `/api/meals/:id` - Delete meal

### Daily Intake
- **GET** `/api/daily-intake` - Get daily intake records
- **POST** `/api/daily-intake` - Add meal to daily intake

### Nutrient Targets
- **GET** `/api/nutrient-targets` - Get nutrient targets
- **PUT** `/api/nutrient-targets` - Update nutrient targets

### Diet Chart
- **POST** `/api/generate-diet-chart` - Generate personalized diet chart

### Health Check
- **GET** `/api/health` - API health status

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Request/Response Examples

### User Registration
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c8b1f8c4e1a1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Create Meal
```bash
POST /api/meals
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Breakfast",
  "timeOfDay": "8:00 AM",
  "waterIntake": 250,
  "foods": [
    {
      "food": "60d5ec49f1b2c8b1f8c4e1a2",
      "quantity": 1
    }
  ]
}
```

### Search Foods
```bash
GET /api/foods?search=chicken&category=PROTEIN&page=1&limit=10
Authorization: Bearer <token>
```

## Error Handling

The API returns consistent error responses:
```json
{
  "error": "Error message",
  "details": ["Validation error details"]
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Deployment

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/kidney-health
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Heroku Deployment
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create kidney-health-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set MONGODB_URI=your-mongodb-atlas-uri

# Deploy
git push heroku main
```

### Production Considerations

1. **Environment Variables**: Use secure, production-ready values
2. **Database**: Use MongoDB Atlas or a managed database service
3. **Logging**: Implement structured logging with services like Winston
4. **Monitoring**: Set up application monitoring (New Relic, DataDog)
5. **SSL**: Enable HTTPS in production
6. **Backup**: Regular database backups
7. **Load Balancing**: Use a load balancer for high availability

## Data Models

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String,
  age: Number,
  weight: Number,
  height: Number,
  ckdStage: Enum,
  medicalConditions: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Food Schema
```javascript
{
  name: String,
  category: Enum,
  servingSize: Number,
  servingSizeUnit: String,
  nutrients: {
    protein: Number,
    calories: Number,
    carbohydrates: Number,
    fats: Number,
    potassium: Number,
    phosphorus: Number,
    sodium: Number,
    calcium: Number,
    magnesium: Number,
    water: Number
  },
  isKidneyFriendly: Boolean,
  createdAt: Date
}
```

### Meal Schema
```javascript
{
  userId: ObjectId,
  name: String,
  timeOfDay: String,
  waterIntake: Number,
  foods: [{
    food: ObjectId,
    quantity: Number
  }],
  createdAt: Date
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: Prevents API abuse
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Express Validator for data validation
- **MongoDB Injection Protection**: Mongoose built-in protection

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## API Rate Limits

- **General**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File Upload**: 10 requests per 15 minutes

## Support

For support and questions, please contact the development team or create an issue in the repository.

## License

This project is licensed under the MIT License.