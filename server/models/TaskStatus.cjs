// @ts-check
const BaseModel = require('./BaseModel.cjs');
const Task = require('./Task.cjs');

const objectionUnique = require('objection-unique');
const unique = objectionUnique({ fields: ['name'] });

module.exports = class Status extends unique(BaseModel) {
    static get tableName() {
        return 'statuses';
    }

    static get relationMappings() {
        return {
            task: {
                relation: BaseModel.HasManyRelation,
                modelClass: Task,
                join: {
                    from: 'statuses.id',
                    to: 'tasks.statusId',
                }
            }
        }
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1, maxLength: 255 },
            },
        };
    }
}
