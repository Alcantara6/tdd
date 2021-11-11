describe('onError test', function () {
	it('should set the error DOM element', function () {
		var domElement = {innerHTML: ''};  // DOM元素的测试替身
		sandbox.stub(document, 'getElementById') // 模拟onError函数
					 .withArgs('error')
					 .returns(domElement); 
		
		var message = "you're kidding";
		var positionError = {message: message};  // positionError实例的测试替身

		onError(positionError);
		expect(domElement.innerHTML).to.be.eql(message);
	});
});