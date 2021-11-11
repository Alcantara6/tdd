/**
 * 纸笔书写条件—— 测试列表
 * 代码在所有浏览器上都可以正常运行
 * 代码可以与服务器交互
 * 代码可以正确响应用户的命令
 */
describe('palindrome-test', function () {
	
	// 金丝雀测试
	it('should pass this canary test', function () {
		expect(true).to.be.true;
	});

	it ('should true for argument mom', function () {
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