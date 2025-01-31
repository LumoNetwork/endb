'use strict';

/**
 * General utility methods for Endb.
 */
class Util {
	constructor() {
		throw new Error(
			`The ${this.constructor.name} class may not be instantiated.`
		);
	}

	/**
	 * Adds the namespace as a prefix to the key.
	 * @param {string|string[]} key The key(s) of an element.
	 * @param {string} namespace The namespace of the database.
	 * @return {string}
	 */
	static addKeyPrefix(key, namespace) {
		if (Array.isArray(key)) {
			return key.map(k => `${namespace}:${k}`);
		}

		return `${namespace}:${key}`;
	}

	/**
	 * Checks whether a value is buffer-like or not.
	 * @param {*} value The value to check.
	 * @return {boolean}
	 */
	static isBufferLike(value) {
		return (
			value !== null &&
			typeof value === 'object' &&
			value.type === 'Buffer' &&
			(Array.isArray(value.data) || typeof value.data === 'string')
		);
	}

	static get(object, path, defaultValue) {
		const travel = regexp =>
			String.prototype.split
				.call(path, regexp)
				.filter(Boolean)
				.reduce(
					(res, key) => (res !== null && res !== undefined ? res[key] : res),
					object
				);
		const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
		return result === undefined || result === object ? defaultValue : result;
	}

	static load(options) {
		const adapters = {
			level: './adapters/leveldb',
			leveldb: './adapters/leveldb',
			mongo: './adapters/mongodb',
			mongodb: './adapters/mongodb',
			mysql: './adapters/mysql',
			mysql2: './adapters/mysql',
			postgres: './adapters/postgres',
			postgresql: './adapters/postgres',
			redis: './adapters/redis',
			sqlite: './adapters/sqlite',
			sqlite3: './adapters/sqlite'
		};
		if (options.adapter || options.uri) {
			const adapter = options.adapter || /^[^:]*/.exec(options.uri)[0];
			if (adapters[adapter] !== undefined) {
				return new (require(adapters[adapter]))(options);
			}
		}

		return new Map();
	}

	/**
	 * Parses a JSON string, constructing the JavaScript value or object described by the string.
	 * @param {string} text The string to parse as JSON.
	 * @return {Object} The `Object` corresponding to the given JSON text.
	 */
	static parse(text) {
		return JSON.parse(text, (_key, value) => {
			if (Util.isBufferLike(value)) {
				if (Array.isArray(value.data)) {
					return Buffer.from(value.data);
				}

				if (typeof value.data === 'string') {
					if (value.data.startsWith('base64:')) {
						return Buffer.from(value.data.slice('base64:'.length), 'base64');
					}

					return Buffer.from(value.data);
				}
			}

			return value;
		});
	}

	/**
	 * @param {number} base
	 * @param {string} op
	 * @param {number} opand
	 * @return {number}
	 */
	static math(base, op, opand) {
		switch (op) {
			case 'add':
			case 'addition':
			case '+':
				return base + opand;
			case 'sub':
			case 'subtract':
			case '-':
				return base - opand;
			case 'mult':
			case 'multiply':
			case '*':
				return base * opand;
			case 'div':
			case 'divide':
			case '/':
				return base / opand;
			case 'exp':
			case 'exponent':
			case '^':
				return base ** opand;
			case 'mod':
			case 'modulo':
			case '%':
				return base % opand;
			default:
				return opand;
		}
	}

	/**
	 * Removes the namespace as a prefix from a key.
	 * @param {string} key The key of an element.
	 * @param {string} namespace The namespace of the database.
	 * @return {string}
	 */
	static removeKeyPrefix(key, namespace) {
		return key.replace(`${namespace}:`, '');
	}

	/**
	 * Safely import modules from `node_modules`; local module and JSOn can be imported using a relative path.
	 * @param {string} id The name or path of the module.
	 * @return {*} Exported module content.
	 * @private
	 */
	static safeRequire(id) {
		try {
			return require(id);
		} catch (error) {
			if (['sqlite', 'mysql', 'postgres'].some(a => id.startsWith(a))) {
				if (id === 'mysql2/promise') id = 'mysql';
				id += ' & sql';
			}

			console.error(
				`Install ${id} to continue; run "npm i ${id
					.split(' & ')
					.join(' ')}" to install.`
			);
			return process.exit(0);
		}
	}

	static set(object, path, value) {
		if (new Object(object) !== object) return object;
		if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];
		path
			.slice(0, -1)
			.reduce(
				(a, c, i) =>
					new Object(a[c]) === a[c]
						? a[c]
						: (a[c] =
								Math.abs(path[i + 1]) >> 0 === Number(path[i + 1]) ? [] : {}),
				object
			)[path[path.length - 1]] = value;
		return object;
	}

	/**
	 * Converts a JavaScript object or value to a JSON string
	 * @param {*} value The value to convert to a JSON string.
	 * @param {string|number} [space] A `String` or `Number` object that's used to insert white space into the output JSON string for readability purposes.
	 * @return {string} A JSON string representing the given value.
	 */
	static stringify(value, space) {
		return JSON.stringify(
			value,
			(_key, value) => {
				if (Util.isBufferLike(value)) {
					if (Array.isArray(value.data)) {
						if (value.data.length > 0) {
							value.data = `base64:${Buffer.from(value.data).toString(
								'base64'
							)}`;
						} else {
							value.data = '';
						}
					}
				}

				return value;
			},
			space
		);
	}

	static validateOptions(options) {
		if (options.uri && typeof options.uri !== 'string') {
			throw new TypeError('The option "uri" must be a string.');
		}

		if (options.namespace && typeof options.namespace !== 'string') {
			throw new TypeError('The option "namespace" must be a string.');
		}

		if (options.adapter && typeof options.adapter !== 'string') {
			throw new TypeError('The option "adapter" must be a string.');
		}

		if (options.serialize && typeof options.serialize !== 'function') {
			throw new TypeError('The option "serialize" must be a function.');
		}

		if (options.deserialize && typeof options.deserialize !== 'function') {
			throw new TypeError('The option "deserialize" must be a function');
		}

		if (options.collection && typeof options.collection !== 'string') {
			throw new TypeError('The option "collection" must be a string.');
		}

		if (options.table && typeof options.table !== 'string') {
			throw new TypeError('The option "table" must be a string.');
		}
	}
}

module.exports = Util;
