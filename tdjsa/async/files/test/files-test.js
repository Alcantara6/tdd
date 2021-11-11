/**
 * 异步机制
 * 没有添加done()的话，相当于在默认的2秒后done()，不管有没有执行到断言，都算作超时失败
 * 如果在断言后添加了done()，也就是在断言之后结束，判定测试结果
 */
var expect = require('chai').expect;
var linesCount = require('../src/files');

describe('test async server-side', function () {
	it('should return correct lines count for a valid file', function (done) {
		var callback = function (count) {
			expect(count).to.be.eql(15);
			done();
		}
    // 注意文件路径是基于主路径
		linesCount('src/files.js', callback);
	});

	it('should report error for an invalid file name', function (done) {
		var onError = function (error) {
			expect(error).to.be.eql('unable to open file src/flies.js');
			done();
		}
		// 这个地方很脆弱
		linesCount('src/flies.js', undefined, onError);
	});
});