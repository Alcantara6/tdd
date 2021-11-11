var expect = require('chai').expect;
// use函数用eventually属性扩展了chai的函数
require('chai').use(require('chai-as-promised'));
var countLines = require('../src/files');

describe('test promise', function () {
	// 1. 使用done()进行测试：then+done
	it('should return correct lines count - using done()', function (done) {
		var checkCount = function (count) {
			expect(count).to.be.eql(15);
			done();
		}
		countLines('src/files.js').then(checkCount);
	});

	// 2. 返回promise的测试，return + then
	it('should return correct lines count - using return promise', function () {
		var checkCount = function (count) {
			expect(count).to.be.eql(15);
		}

		return countLines('src/files.js').then(checkCount);
	})

	// 3. 使用chai-as-promised: return expect(func())...to.eventually.eql
	it('should return correct lines count - using eventually', function () {
		return expect(countLines('src/files.js')).to.eventually.eql(15);
	});

	// 4. 结合eventually和done()，不是所有的工具都提供返回promise的功能：expect(func())...to.eventually.eql.notify
	it('should return correct lines count - using done and eventually and no return', function (done) {
		expect(countLines('src/files.js')).to.eventually.eql(15).notify(done);
	});

	// 5. 为promise编写反向测试，只能验证Promise变成失败状态: expect(func())...to.be.rejected.notify
	it('should report error for an invalid file name', function (done) {
		expect(countLines('src/flies.js')).to.be.rejected.notify(done);
	});

	// 6. 为promise编写反向测试，验证是否传递了预期的错误信息: expect(func())...to.be.rejectedWith.notify
	it('should report error for an invalid file name - using with', function (done) {
		expect(countLines('src/flies.js')).to.be.rejectedWith('unable to open file src/flies.js').notify(done);
	});
});