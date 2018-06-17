var expect = require('expect');
var { isRealString } = require('./validation');

describe('validateString', () => {
	it('should reject non-string value', () => {
		var nonString = Number();
		var stringCheck = isRealString(nonString);

		expect(stringCheck).toBe(false);
	});

	it('should reject string with only spaces', () => {
		var nonString = '      ';
		var stringCheck = isRealString(nonString);

		expect(stringCheck).toBe(false);
	});

	it('should allow string with no-space characters', () => {
		var nonString = ' xxExampleString To trim     ';
		var stringCheck = isRealString(nonString);

		expect(stringCheck).toBe(true);
	});
});