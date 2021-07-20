# @umajs/plugin-redis



## Install
`npm install @umajs/plugin-redis`





## Configuration
基于 `ioredis`, 更多详细配置请参考 [ioredis](https://www.npmjs.com/package/ioredis)

```js

// config/plugin.config.ts

// Single Client
export default {
    'redis': {
        enable: true,
        name: 'redis',
        options: {
            client: {
              port: 6379, // Redis port
              host: '127.0.0.1', // Redis host
              password: 'auth', //Redis password
              db: 0,
            }
        },
    },
};


// Multi Clients
export default {
    'redis': {
        enable: true,
        name: 'redis',
        options: {
          clients: {
            instance1: {           // instanceName. See below
              port: 6379,          // Redis port
              host: '127.0.0.1',   // Redis host
              password: 'auth',
              db: 0,
            },
            instance2: {
              port: 6379,
              host: '127.0.0.1',
              password: 'auth',
              db: 1,
            },
          }
        },
    },
};



// cluster 
export default {
    'redis': {
        enable: true,
        name: 'redis',
        options: {
          client: {
            cluster: true,
            nodes: [
              {           
                port: 6380,          // Redis port
                host: '127.0.0.1',   // Redis host
              },
              {           
                port: 6380,          // Redis port
                host: '127.0.0.1',   // Redis host
              }
            ],
            clusterOptions: {
              redisOptions: { password: 'auth' }
            }
          }
        }
    }
};

// Sentinel
export default {
    'redis': {
        enable: true,
        name: 'redis',
        options: {
          client: {
            sentinels: [{          // Sentinel instances
              port: 26379,         // Sentinel port
              host: '127.0.0.1',   // Sentinel host
            }],
            name: 'mymaster',      // Master name
            password: 'auth',
            db: 0
          },
        },
    },
};

```





## Usage

```js
// controller/index.controller.ts
// redis client 的实例挂载在 ctx 上

export default class Index extends BaseController {
    async index() {
        // single client
        await this.ctx.redis.set('test:key:1', 1);
        const value = await this.ctx.redis.get('test:key:1');
        await this.ctx.redis.del('test:key:1');
        return Result.send(`single redis test【key = test:key:1, value = ${value}】`);
    }
}


export default class Index extends BaseController {
    async index() {
        // multi Clients
        // 执行操作之前，先通过get 方法获取对应的client实例
        await this.ctx.redis.get('instance1').set('test:key:1', 1);
        const value = await this.ctx.redis.get('instance1').get('test:key:1');
        await this.ctx.redis.get('instance1').del('test:key:1');
        return Result.send(`multi redis test【key = test:key:1, value = ${value}】`);
    }
}

```
