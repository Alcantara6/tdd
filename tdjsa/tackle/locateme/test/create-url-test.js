describe('create url test', function () {
	it('should return proper url given lat and lon', function () {
		var latitude = -33.857;
		var longitude = 151.215

		var url = createURL(latitude, longitude);

		expect(url).to.be.eql('http://maps.google.com?q=-33.857,151.215');
	});

	// TODO: 这个测试只是向被测代码传递了一组不同的值。有意义吗?
	it('should return proper url given lat and lon', function () {
		var latitude = 37.826;
		var longitude = -122.423

		var url = createURL(latitude, longitude);

		expect(url).to.be.eql('http://maps.google.com?q=37.826,-122.423');
	});

	it('should return empty url if latitude is undefined', function () {
		var latitude = undefined;
		var longitude = -122.423

		var url = createURL(latitude, longitude);

		expect(url).to.be.eql('');
	});

	it('should return empty url if longitude is undefined', function () {
		var latitude = 37.826;
		var longitude = undefined;

		var url = createURL(latitude, longitude);

		expect(url).to.be.eql('');
	});
});