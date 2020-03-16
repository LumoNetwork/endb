'use strict';

const {safeRequire} = require('../util');
const Sql = require('./Sql');

module.exports = class PostgreSQL extends Sql {
	constructor(options = {}) {
		options = Object.assign(
			{
				dialect: 'postgres',
				uri: 'postgresql://localhost:5432'
			},
			options
		);
		options.connect = () =>
			Promise.resolve().then(() => {
				const client = new (options.adapter || safeRequire('pg')).Pool({
					connectionString: options.uri
				});
				return sql => client.query(sql).then(data => data.rows);
			});
		super(options);
	}
};
