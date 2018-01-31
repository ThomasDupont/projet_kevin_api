module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: '',
            script: 'main.js',
            env: {
                COMMON_VARIABLE: 'true'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ],

    /**
     * Deployment section
     * http://pm2.keymetrics.io/docs/usage/deployment/
     */
    deploy: {
        prod: {
            user: '',
            host: '',
            ref: 'origin/master',
            repo: 'git@github.com',
            path: '/var/www/production',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        },
        preprod: {
            user: '',
            host: '',
            ref: 'origin/preprod',
            repo: 'git@github.com',
            path: '/var/www/preprod',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};
