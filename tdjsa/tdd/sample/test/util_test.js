var expect = require('chai').expect;
var Util = require('../src/util');

// describe 测试套件
describe('util tests', function () {
	// 金丝雀测试
	// it 测试用例
	it('should pass this canary test', function () {
		expect(true).to.eql(true);
	});

	var util;
	beforeEach(function () {
		util = new Util();
	});

	it('should pass if f2c returns 0C for 32F', function () {
		// Arrange 准备
		var fahrenheit = 32;

		// Act 行动
		var celsius = util.f2c(fahrenheit);

		// Assert 断言
		expect(celsius).to.eql(0);
	});

	it('should pass if f2c returns 10C for 50F', function () {
		var fahrenheit = 50;

		var celsius = util.f2c(fahrenheit);

		expect(celsius).to.eql(10);
	});
});