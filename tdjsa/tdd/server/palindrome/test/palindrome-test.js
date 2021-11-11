/**
 * 纸笔书写条件—— 测试列表
 * mom是回文
 * dad是回文
 * dude不是回文
 * mom mom是回文
 * mom dad不是回文
 * 空字符串不是回文
 * 一个只包含两个空白字符的字符串不是回文
 */

var expect = require('chai').expect;
var isPalindrome = require('../src/palindrome');

describe('palindrome-test', function () {

	// 金丝雀测试
	it('should pass this canary test', function () {
		expect(true).to.be.true;
	});

	// 正向测试
	it ('should return true for argument mom', function () {
		expect(isPalindrome('mom')).to.be.true;
	});

	it('should return true for argument dad', function () {
		expect(isPalindrome('dad')).to.be.true;
	});

	it('should return false for argument dude', function () {
		expect(isPalindrome('dude')).to.be.false;
	});

	it('should return false for argument mom mom', function () {
		expect(isPalindrome('mom mom')).to.be.true;
	});

	it('should return false for argument mom dad', function () {
		expect(isPalindrome('mom dad')).to.be.false;
	});

	// 反向测试
	it('should return false when argument is an empty string', function () {
		expect(isPalindrome('')).to.be.false;
	});

	it('should return false for argument with only two spaces', function () {
		expect(isPalindrome(' ')).to.be.false;
	});

	// 异常测试
	it('should throw an exception if argument is missing', function () {
		var call = function () {
			isPalindrome();
		}

		// 如果传递的是一个函数，expect就会调用这个函数，并检查任何可能抛出的异常
		expect(call).to.throw(Error, 'Invalid argument');
	});
});