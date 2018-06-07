var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object', () => {
		var passedFrom = 'John';
		var passedText = 'Lorem ipsum dolor sit amet';
		var generatedObject = generateMessage(passedFrom, passedText);

		expect(generatedObject.createdAt).toBeA('number');
		expect(generatedObject).toInclude({
			from: passedFrom,
			text: passedText
		});
	});
});