describe('locate test', function () {
	// 注意没有done参数
	it('should register handlers with getCurrentPosition', function () {

		// 对navigator.geolocation这个对象mock
		// 这个mock函数将验证传递的参数是否与withArgs中指定的参数相符
		var getCurrentPositionMock 
			= sandbox.mock(navigator.geolocation)
							 .expects('getCurrentPosition')
							 .withArgs(onSuccess, onError);
							
		locate();

		getCurrentPositionMock.verify();
	});
});