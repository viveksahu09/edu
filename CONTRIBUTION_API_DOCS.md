# Contribution System API Documentation

## Overview
The contribution system allows users to submit educational content that requires admin approval before appearing in the "Explore Research Topics" section.

## API Endpoints

### Submit Contribution
- **POST** `/api/contributions/submit`
- **Authentication**: Required
- **Body**:
  ```json
  {
    "title": "Introduction to Machine Learning",
    "description": "A comprehensive guide to ML basics",
    "content": "Detailed content here...",
    "type": "topic", // options: note, project, research_paper, query, topic
    "category": "Computer Science",
    "tags": ["machine-learning", "ai", "beginners"]
  }
  ```

### Get User Contributions
- **GET** `/api/contributions/my-contributions`
- **Authentication**: Required
- **Query Params**: `status`, `page`, `limit`

### Get All Contributions (Admin)
- **GET** `/api/contributions/all`
- **Authentication**: Admin required
- **Query Params**: `status`, `page`, `limit`

### Approve Contribution (Admin)
- **PUT** `/api/contributions/:id/approve`
- **Authentication**: Admin required

### Reject Contribution (Admin)
- **PUT** `/api/contributions/:id/reject`
- **Authentication**: Admin required
- **Body**:
  ```json
  {
    "rejectionReason": "Content needs more detail"
  }
  ```

### Get Research Topics (Public)
- **GET** `/api/contributions/research-topics`
- **Query Params**: `category`, `difficulty`, `page`, `limit`

## Database Schema

### Contributions Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `content` (Text)
- `type` (Enum: note, project, research_paper, query, topic)
- `category` (String)
- `tags` (JSON)
- `status` (Enum: pending, approved, rejected, published)
- `userId` (UUID, Foreign Key)
- `approvedBy` (UUID, Foreign Key, nullable)
- `approvedAt` (DateTime, nullable)
- `rejectionReason` (Text, nullable)
- `views` (Integer, default: 0)
- `likes` (Integer, default: 0)

### Research Topics Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `category` (String)
- `difficulty` (Enum: beginner, intermediate, advanced)
- `tags` (JSON)
- `estimatedTime` (String)
- `prerequisites` (JSON)
- `learningObjectives` (JSON)
- `resources` (JSON)
- `contributionId` (UUID, Foreign Key)
- `isActive` (Boolean, default: true)
- `featured` (Boolean, default: false)
- `views` (Integer, default: 0)
- `enrollments` (Integer, default: 0)

## Workflow

1. **User submits contribution** → Status: `pending`
2. **Admin reviews** → Can approve or reject
3. **If approved**:
   - Status changes to `approved`
   - If type is `topic`, creates entry in Research Topics table
   - Appears in "Explore Research Topics"
4. **If rejected**:
   - Status changes to `rejected`
   - User sees rejection reason

## Setup Requirements

1. MySQL database running
2. Environment variables configured:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=edusolgrow
   DB_USER=root
   DB_PASSWORD=your_password
   ```

3. Run migrations: `npm start` (auto-syncs models)

## Testing

The contribution system is now implemented and ready for testing once the database connection is established.
