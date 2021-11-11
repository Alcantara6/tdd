describe('fetch location test of browser', function () {
	it('should get lat and lon from fetchLocation', function (done) {
		var onSuccess = function (geolocation) {
			expect(geolocation).to.be.have.property('lat');
			expect(geolocation).to.be.have.property('lon');
			done();
		}

		// 调用了onError函数，则测试就会报告失败
		var onError = function () {
			throw 'not expected，调用出错';
		}

		this.timeout(10000);

		fetchLocation(onSuccess, onError);
	});
});