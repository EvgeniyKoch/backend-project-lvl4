// @ts-check
const BaseModel = require('./BaseModel.cjs');
const User = require('./User.cjs');
const Status = require('./Status.cjs');

const objectionUnique = require('objection-unique');
const unique = objectionUnique({ fields: ['name'] });

module.exports = class Task extends unique(BaseModel) {
    static get tableName() {
        return 'tasks';
    }

    static get relationMappings() {
       return {
            status: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Status,
                join: {
                    from: 'tasks.statusId',
                    to: 'statuses.id',
                }
            },
           creator: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'tasks.creatorId',
                    to: 'users.id',
               }
           },
           executor: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'tasks.executorId',
                    to: 'users.id',
                }
           }
       }
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'statusId', 'creatorId'],
            properties: {
                id: { type: 'integer', minLength: 1 },
                name: { type: 'string', minLength: 1, maxLength: 255 },
                statusId: { type: 'integer', minLength: 1 },
                creatorId: { type: 'integer', minLength: 1 },
            },
        };
    }
}
