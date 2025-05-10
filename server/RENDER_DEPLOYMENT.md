# Render Deployment Guide

## Environment Configuration

This application has been configured to work properly on Render.com's deployment environment. The following changes have been made:

1. Added detection for Render.com environment using `process.env.RENDER`
2. Implemented dynamic path resolution for static files based on the deployment environment
3. Added health check endpoints at `/api/health` and `/api/auth/status`
4. Added fallback handling when the client build directory doesn't exist

## Deployment Troubleshooting

### Common Issues

#### Missing Static Files

If you encounter errors like `ENOENT: no such file or directory, stat '/opt/render/project/src/client/dist/index.html'`, it means the frontend build files are not available at the expected location.

Possible solutions:

1. **Separate Deployments**: If you're deploying the backend and frontend separately, you can ignore these errors as the API will still function correctly.

2. **Full-Stack Deployment**: If you want to deploy both frontend and backend together:
   - Ensure your build script includes building the frontend
   - Make sure the build output is in the expected location
   - Check that the `client/dist` directory is included in your deployment

### Build Configuration

For a full-stack deployment on Render, your build command should include:

```
cd client && npm install && npm run build && cd ../server && npm install
```

And your start command should be:

```
cd server && node index.js
```

## MongoDB Atlas Configuration

### Environment Variables

Ensure your MongoDB connection string is properly configured in your Render environment variables:

1. In your Render dashboard, navigate to your service
2. Go to the "Environment" tab
3. Add or update the `MONGODB_URI` environment variable with your MongoDB Atlas connection string
4. Make sure to include your username, password, and database name in the connection string
5. Click "Save Changes" and deploy your service again

### IP Whitelisting

If you encounter a MongoDB connection error like this:

```
MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

You need to whitelist Render's IP addresses in your MongoDB Atlas configuration:

1. Log in to your [MongoDB Atlas account](https://cloud.mongodb.com/)
2. Navigate to your project and select "Network Access" under the Security section
3. Click "Add IP Address"
4. For Render deployments, you have two options:
   - **Option 1 (Recommended)**: Add Render's IP addresses specifically
     - Find your Render service's outbound IP addresses in the Render dashboard under your service's "Outbound IPs" section
     - Add each IP address individually to the MongoDB Atlas whitelist
     - You can find these IPs in the Render dashboard by going to your service → Settings → Outbound IPs
   - **Option 2**: Allow access from anywhere (less secure, only for development)
     - Add `0.0.0.0/0` to allow connections from any IP address
     - Note: This is not recommended for production environments due to security concerns
5. Save your changes

#### Temporary Access Options

MongoDB Atlas also supports creating temporary IP access list entries that expire after a configurable period (up to 7 days). This can be useful for testing:

1. When adding an IP address, check the "Temporary" option
2. Set an expiration time (from 1 hour up to 7 days)
3. Add a comment to identify the purpose of this temporary access

After whitelisting the appropriate IP addresses, restart your Render service for the changes to take effect.

## API Access

Even if the frontend is not deployed, all API endpoints will continue to function correctly. You can access them directly at:

- `/api/auth/*` - Authentication endpoints
- `/api/scrape/*` - Web scraping endpoints
- `/api/users/*` - User management endpoints
- `/api/convert/*` - URL conversion endpoints