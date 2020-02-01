import storage from '../src/storage';

test('should get key', async t => {
	const s = await storage.get('preferences');
	console.log(s);
});
