import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteSitemap from 'vite-plugin-sitemap';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    react(),
    viteSitemap({
      // IMPORTANT: Change this to your actual production domain when deploying!
      // For development, you can use localhost, but it won't generate a useful sitemap for a real site.
      // Example: 'https://www.yourblogname.com'
      baseUrl: 'http://localhost:5173/', // Corrected: removed '.com' and used http for dev
      routes: ['/', '/blog', '/about', '/contact'],
      generateRobotsTxt: true
    }),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'MyBlog',
          description: 'Tech & life blog'
        }
      }
    })
  ],
  server: {
    port: 5173, // Ensure this matches your frontend development port
    proxy: {
      // Proxy requests starting with '/api' to your backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend server's URL
        changeOrigin: true, // Needed for virtual hosted sites
        // This rewrite rule isn't strictly necessary if your backend's app.use('/api', ...) already handles the prefix.
        // However, it's good practice to understand how it works.
        // For your current backend setup (app.use('/api/auth', authRouter);),
        // your frontend calls '/api/auth/signup', and the backend expects '/api/auth/signup'.
        // So, no rewrite is needed for that to work correctly.
        // rewrite: (path) => path.replace(/^\/api/, ''), // Use this if your backend routes DON'T have /api
      },
    },
  },
});