 /**
	* 依赖注入的测试 （windowStub注入）
  */
 describe('setLocation test', function () {
	 it('should set the URL into location of window', function () {
		 var windowStub = {};
		 var url = 'http://example.com.cn';

		 setLocation(windowStub, url);

		 expect(windowStub.location).to.be.eql(url);
	 });
 });