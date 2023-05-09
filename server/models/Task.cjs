// @ts-check
const BaseModel = require('./BaseModel.cjs');
const objectionUnique = require('objection-unique');

const unique = objectionUnique({ fields: ['name', 'statusId', 'creatorId'] });

module.exports = class Task extends unique(BaseModel) {
    static get tableName() {
        return 'tasks';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1, maxLength: 255 },
                description: { type: 'string', minLength: 1, maxLength: 255 },
            },
        };
    }
}
