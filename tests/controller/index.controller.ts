import { BaseController, Result } from '@umajs/core';

export default class Index extends BaseController {

    async index() {
        // single client
        await this.ctx.redis.set('test:key:1', 1);
        const value = await this.ctx.redis.get('test:key:1');
        await this.ctx.redis.del('test:key:1');
        return Result.send(`single redis test【key = test:key:1, value = ${value}】`);


        // multi Clients
        // await this.ctx.redis.get('instance1').set('test:key:1', 1);
        // const value = await this.ctx.redis.get('instance1').get('test:key:1');
        // await this.ctx.redis.get('instance1').del('test:key:1');
        // return Result.send(`multi redis test【key = test:key:1, value = ${value}】`);
    }
}
