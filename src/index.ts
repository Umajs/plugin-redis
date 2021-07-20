import { Uma, TPlugin } from "@umajs/core";
import * as Redis from 'ioredis';
import * as assert from 'assert';

interface ClientsInstance {
  [key: string] : Redis.Cluster | Redis.Redis
}

const info = Uma.context.logger ? Uma.context.logger.info : console.log;
const error = Uma.context.logger ? Uma.context.logger.error : console.error;

/**
 * @desc 根据配置生成redis client
 * @param config 
 * @param clientName 
 */
function _generateRedisClient (config: any, clientName ?:string ): Redis.Cluster | Redis.Redis {
  let client: Redis.Cluster | Redis.Redis  = null;
  clientName = clientName || '';

  if (config.cluster === true) {
    assert(config.nodes && config.nodes.length !== 0, '[umajs-plugin-redis] cluster nodes configuration is required when use cluster redis');
    config.nodes.forEach(client => {
      assert(client.host && client.port,
        `[umajs-plugin-redis] 'host: ${client.host}', 'port: ${client.port}', are required on config`);
    });

    info('[umajs-plugin-redis] cluster connecting');
    client = new Redis.Cluster(config.nodes, config.clusterOptions);
  } else if (config.sentinels) {
    assert(config.sentinels && config.sentinels.length !== 0, '[umajs-plugin-redis] sentinels configuration is required when use redis sentinel');
    config.sentinels.forEach(sentinel => {
      assert(sentinel.host && sentinel.port,
        `[umajs-plugin-redis] 'host: ${sentinel.host}', 'port: ${sentinel.port}' are required on config`);
    });

    assert(config.name && config.password !== undefined && config.db !== undefined,
      `[umajs-plugin-redis] 'name of master: ${config.name}', 'password: ${config.password}', 'db: ${config.db}' are required on config`);
    info('[umajs-plugin-redis] sentinel connecting start');
    client = new Redis(config);
  } else {
    assert(config.host && config.port && config.password !== undefined && config.db !== undefined,
      `[umajs-plugin-redis] 'host: ${config.host}', 'port: ${config.port}', 'password: ${config.password}', 'db: ${config.db}' are required on config`);
    info('[umajs-plugin-redis] server connecting redis://:***@%s:%s/%s',
    config.host, config.port, config.db);
    client = new Redis(config);
  }

  client.on('connect', () => {
    info(`[umajs-plugin-redis] client ${clientName} connect success'`);
  });

  client.on('error', err => {
    error(`[umajs-plugin-redis] client ${clientName} error: %s`, err);
    error(err);
  });

  client.once('ready', () => {
    info(`[umajs-plugin-redis] client ${clientName} client ready`);
  });

  return client;
}


export default (uma: Uma, options: any = {}): TPlugin => {
    if (options.client) {
      const client: Redis.Cluster | Redis.Redis  =  _generateRedisClient(options.client);
      return {
        context: {
          redis: client
        }
      };
    } else if (options.clients) {
      let clients: ClientsInstance = {};

      Object.keys(options.clients).forEach(key => {
        clients[key] = _generateRedisClient((options.clients)[key], key);
      });

      return {
        context: {
          redis: {
            get: function(clientName: string): Redis.Cluster | Redis.Redis{
              return clients[clientName];
            }
          }
        }
      };
    }
};
