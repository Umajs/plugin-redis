export default {
    'redis': {
        options: {
            client: {
              port: 6379, // Redis port
              host: '127.0.0.1', // Redis host
              password: '', //Redis password
              db: 0,
            }
            // clients: {
            //   "instance1": {
            //     port: 6379, // Redis port
            //     host: '127.0.0.1', // Redis host
            //     password: '', //Redis password
            //     db: 0,
            //   },
            //   "instance2": {
            //     port: 50037, // Redis port
            //     host: 'test-xxx.org', // Redis host
            //     password: 'test-xxx.org', //Redis password
            //     db: 0,
            //   }
            // }
        },
    },
};
