module.exports = {
    apps: [{
        name: 'GRAPHQL_GRIFFOULEDUCATION',
        script: 'npm',
        args: "run start",




        // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
        instances: 1,
        autorestart: true,
        max_memory_restart: '1G',
       
    }],

   
};

//pm2 start ecosystem.config.js--only GRAPHQL_GRIFFOULEDUCATION
