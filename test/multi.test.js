const test = require('ava');
const Endb = require('../src');

test.serial('Multiple Endb instances', async t => {
	const endb = Endb.multi(['members', 'users']);
	t.is(await endb.members.set('foo', 'bar'), true);
	t.is(await endb.users.set('bar', 'foo'), true);
	t.is(await endb.members.has('foo'), true);
	t.is(await endb.users.has('bar'), true);
	t.is(await endb.members.get('foo'), 'bar');
	t.is(await endb.users.get('bar'), 'foo');
	t.is(await endb.members.clear(), undefined);
	t.is(await endb.users.clear(), undefined);
});
