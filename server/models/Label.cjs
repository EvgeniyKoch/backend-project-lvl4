// @ts-check
const BaseModel = require('./BaseModel.cjs');
const Task = require('./Task.cjs');

const objectionUnique = require('objection-unique');
const unique = objectionUnique({ fields: ['name'] });

module.exports = class Label extends unique(BaseModel) {
    static get tableName() {
        return 'labels';
    }

    static get relationMappings() {
        return {
            task: {
                relation: BaseModel.HasManyRelation,
                modelClass: Task,
                join: {
                    from: 'labels.id',
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
                name: { type: 'string', minLength: 1, maxLength: 25 },
            },
        };
    }
}
