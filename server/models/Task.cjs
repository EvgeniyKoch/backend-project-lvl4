// @ts-check
const BaseModel = require('./BaseModel.cjs');
const User = require('./User.cjs');
const TaskStatus = require('./TaskStatus.cjs');

const objectionUnique = require('objection-unique');
const Label = require("./Label.cjs");
const unique = objectionUnique({ fields: ['name'] });

module.exports = class Task extends unique(BaseModel) {
    static get tableName() {
        return 'tasks';
    }

    static get relationMappings() {
       return {
            status: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: TaskStatus,
                join: {
                    from: 'tasks.statusId',
                    to: 'statuses.id',
                }
            },
           label: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Label,
                join: {
                    from: 'task.statusId',
                    to: 'labels.id',
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
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1, maxLength: 255 },
                statusId: { type: 'integer' },
                creatorId: { type: 'integer' },
            },
        };
    }
}
