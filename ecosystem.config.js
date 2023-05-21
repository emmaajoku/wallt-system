module.exports = {
  apps: [
    {
      name: 'backend-graphql-service',
      script: 'dist/app/main.js',

      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'dist/app/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
