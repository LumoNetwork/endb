const test = require('ava');
const Endb = require('../src');

test.serial('Custom Serializers', async t => {
	t.plan(2);
	const endb = new Endb({
		serialize: JSON.stringify,
		deserialize: JSON.parse
	});
	t.is(await endb.set('foo', 'bar'), true);
	t.is(await endb.get('foo'), 'bar');
});

test.serial('Async Serializers', async t => {
	t.pass(4);
	const serialize = async data => {
		t.pass();
		return JSON.stringify(data);
	};

	const deserialize = async data => {
		t.pass();
		return JSON.parse(data);
	};

	const endb = new Endb({serialize, deserialize});
	t.is(await endb.set('foo', 'bar'), true);
	t.is(await endb.get('foo'), 'bar');
});
