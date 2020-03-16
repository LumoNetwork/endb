'use strict';

const {safeRequire} = require('../util');
const Sql = require('./sql');

module.exports = class MySQL extends Sql {
	constructor(options = {}) {
		options = Object.assign(
			{
				dialect: 'mysql',
				uri: 'mysql://localhost'
			},
			options
		);
		options.connect = () =>
			Promise.resolve()
				.then(() =>
					(options.adapter || safeRequire('mysql2/promise')).createConnection(
						options.uri
					)
				)
				.then(connection => {
					return sql => connection.execute(sql).then(data => data[0]);
				});
		super(options);
	}
};
