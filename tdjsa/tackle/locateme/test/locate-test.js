/**
 * 手动创建mock测试替身
 */
describe('locate test', function () {
	it('should register handlers with getCurrentPosition', function (done) {
		var origin = navigator.geolocation.getCurrentPosition;

		// 这个匿名函数就是个测试替身
		navigator.geolocation.getCurrentPosition = function (success, error) {
			expect(success).to.be.eql(onSuccess);
			expect(error).to.be.eql(onError);
			done();
		}

		locate();

		navigator.geolocation.getCurrentPosition = origin;
	});
});