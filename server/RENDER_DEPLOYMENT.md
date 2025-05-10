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

## API Access

Even if the frontend is not deployed, all API endpoints will continue to function correctly. You can access them directly at:

- `/api/auth/*` - Authentication endpoints
- `/api/scrape/*` - Web scraping endpoints
- `/api/users/*` - User management endpoints
- `/api/convert/*` - URL conversion endpoints