var config = {
    production:{
        servers:[
        {
            sshConfig: {
                host: '114,215,133,238',
                port: 80,
                username: '******',
                password: '******',
                readyTimeout: 600000
            }
        }]
    }
};

module.exports = config;
