const test = require('ava');
const Endb = require('../src');

test.serial('Class', t => {
	t.is(typeof Endb, 'function');
	t.throws(() => Endb());
	t.notThrows(() => new Endb());
});
