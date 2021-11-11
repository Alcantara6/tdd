var expect = require('chai').expect;
var sinon = require('sinon');
var fs = require('fs');
var Stockfetch = require('../src/stockfetch');

describe('stockfetch test', function () {
	var sandbox;
	var stockfetch;

	beforeEach(function () {
		stockfetch = new Stockfetch();
		sandbox = sinon.createSandbox();
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('should pass this canary test', function () {
		expect(true).to.be.true;
	});

	// 0. 第一个测试——读取不存在的文件
	it('should invoke error handler for invalid file', function (done) {
		var onError = function (err) {
			expect(err).to.be.eql('Error reading file: InvalidFile');
			done();
		}
		
		// sandbox.stub(fs, 'readFile', function (callback) {
		// 	callback(new Error('failed'));
		// });

		stockfetch.readTickersFile('InvalidFile', onError);
	});

	/**
	 * readTickersFile函数
	 */
	// 1. 正向测试——读取一个有效文件并从中提取出股票代码 
	it('should invoke processTickers handler for valid file', function (done) {
		var rawTickers = '沪深300\n中证500\n创业板指\n贵州茅台';
		var parsedTickers = ['沪深300', '中证500', '创业板指', '贵州茅台'];

		sandbox.stub(stockfetch, 'parseTickers')
					 .withArgs(rawTickers)
					 .returns(parsedTickers);
		
		// 因为异步，所以expect要放在回调函数中，因此使用stub替换原函数，取得参数data
		sandbox.stub(stockfetch, 'processTickers').callsFake(function (data) {
			expect(data).to.be.eql(parsedTickers);
			done();
		});

		sandbox.stub(fs, 'readFile').callsFake(function (fileName, callback) {
				callback(null, rawTickers);
		});

		stockfetch.readTickersFile('tickers.txt');
	});

	// 2. readTickersFile反向测试：读取无效文件
	it('read should return error if given files is empty', function (done) {
		var onError = function(err) {
			expect(err).to.be.eql('File tickers.txt has invalid content');
			done();
		}

		sandbox.stub(stockfetch, 'parseTickers')
					 .withArgs('')
					 .returns([]);

		sandbox.stub(fs, 'readFile').callsFake(function (fileName, callback) {
			callback(null, '')
		});

		stockfetch.readTickersFile('tickers.txt', onError);
	});

	/**
	 * 3.4.5.6 parseTickers函数测试
	 */
	it('parseTickers should return tickers', function () {
		expect(stockfetch.parseTickers('A\nB\nC')).to.be.eql(['A', 'B', 'C']);
	});

	it('parseTickers should return empty array for empty content', function () {
		expect(stockfetch.parseTickers('')).to.be.eql([]);
	});

	it('parseTickers should return empty array for white-space', function () {
		expect(stockfetch.parseTickers(' ')).to.be.eql([]);
	});

	it('parseTickers should ignore unexpected format in content', function () {
		var rawTickers = '沪深300 \n中证 500\n创业板指\n\n';
		expect(stockfetch.parseTickers(rawTickers)).to.be.eql(['创业板指']);
	});

	/**
	 * processTickers函数测试
	 * process函数不需要返回值（stub pass），所以我们只需要用交互测试来验证该函数的行为(需要替身，mock)
	 */
	// 7. 检查processTickers是否对每支股票代码调用getPrice
	it('processTickers should call getPrice for each ticker symbol', function () {
		var stockfetchMock = sandbox.mock(stockfetch);
		// getPrice尚未实现，mock
		stockfetchMock.expects('getPrice').withArgs('A');
		stockfetchMock.expects('getPrice').withArgs('B');
		stockfetchMock.expects('getPrice').withArgs('C');

		stockfetch.processTickers(['A', 'B', 'C']);

		stockfetchMock.verify();
	});

	// 8. 检查processTickers是否将tickersCount作为股票代码的个数
	it('processTickers should save tickers count', function () {
		// An exception is thrown if the property is not already a function
		// 为什么要stub???
		sandbox.stub(stockfetch, 'getPrice');

		stockfetch.processTickers(['A', 'B', 'C']);

		expect(stockfetch.tickersCount).to.be.eql(3);
	});

	/**
	 * getPrice函数测试
	 */
	// 9. getPrice用一个有效的URL作为参数调用http的get函数
	it('getPrice should call get on http with valid URL', function (done) {
		var httpStub = sandbox.stub(stockfetch.http, 'get').callsFake(function (url) {
			expect(url).to.be.eql('http://ichart.finance.yahoo.com/table.csv?s=GOOG');
			done();
			// 这里有返回结果，因此用stub
			return {
				on: function () {}
			};
		});

		stockfetch.getPrice('GOOG');
	});

	// 10. getPrice用一个响应处理器作为参数调用get函数（http.get的第二个参数是web服务器传递数据的注册函数）
	it('getPrice should send a response handler to get', function (done) {
		var aHandler = function () {};

		sandbox.stub(stockfetch.processResponse, 'bind')
					 .withArgs(stockfetch, 'GOOG')
					 .returns(aHandler);

		sandbox.stub(stockfetch.http, 'get').callsFake(function (url, handler) {
			expect(handler).to.be.eql(aHandler);
			done();
			return {
				on: function () {}
			}
		});

		stockfetch.getPrice('GOOG');
	});

	// 11. getPrice为服务器访问失败的情况注册错误处理器
	it('getPrice should register handler for failure to reach host', function (done) {
		var errorHandler = function () {};

		sandbox.stub(stockfetch.processHTTPError, 'bind')
					 .withArgs(stockfetch, 'GOOG')
					 .returns(errorHandler);

		var onStub = function (event, handler) {
			expect(event).to.be.eql('error');
			expect(handler).to.be.eql(errorHandler);
			done();
		}

		sandbox.stub(stockfetch.http, 'get')
					 .returns({
						 on: onStub
						});

		stockfetch.getPrice('GOOG');
	});

	/**
	 * processResponse函数
	 */
	// 12. processResponse用有效的数据作为参数调用parsePrice
	it('processResponse should call parsePrice with valid data', function () {
		var dataFunction;
		var endFunction;

		var response = {
			statusCode: 200,
			on: function (event, handler) {
				if (event === 'data') {
					dataFunction = handler;
				}
				else if (event === 'end') {
					endFunction = handler;
				}
			}
		}

		var parsePriceMock 
			= sandbox.mock(stockfetch)
							 .expects('parsePrice')
							 .withArgs('GOOG', 'some data');
		
		stockfetch.processResponse('GOOG', response);
		dataFunction('some ');  // 真实代码不会执行handler, 这里主动执行
		dataFunction('data');   // 真实代码不会执行handler, 这里主动执行
		endFunction();          // 真实代码不会执行handler, 这里主动执行

		parsePriceMock.verify();
	});

	// 13. 如果响应失败，processResponse调用processError
	it('processResponse should call processError if response failed', function () {
		var response = {
			statusCode: 404
		};

		var processErrorMock 
			= sandbox.mock(stockfetch)
							 .expects('processError')
							.withArgs('GOOG', 404);

		stockfetch.processResponse('GOOG', response);

		processErrorMock.verify();
	});

	// 14. processResponse用有效的数据，不会调用错误处理器
	it('processResponse should call processError only if response failed', function () {
		var response = {
			statusCode: 200,
			on: function () {}
		};

		var processErrorMock = sandbox.mock(stockfetch)
			.expects('processError')
			.never();   // 没有调用错误处理器

		stockfetch.processResponse('GOOG', response);

		processErrorMock.verify();
	});

	/**
	 * processHTTPError函数
	 */
	// 15. 网络不通的情况下，processHTTPError用错误码作为参数调用processError
	it('processHTTPError should call processError with error details', function () {
		var processErrorMock = 
			sandbox.mock(stockfetch)
			.expects('processError')
			.withArgs('GOOG', '...error code...');

			var error = {
				code: '...error code...'
			};

			stockfetch.processHTTPError('GOOG', error);
			processErrorMock.verify();
	});

	/**
	 * parsePrice函数
	 */
	// 16. 解析股票价格并存储
	var data = 'Date,Open,High,Low,Close,Volumn,Adj Close\n\
							2015-09-11,619.75,,,,,,,,625.77002\n\
							2015-09-10,613.00011,,,,,,,,621.34565'
	it('parsePrice should update price', function () {
		stockfetch.parsePrice('GOOG', data);

		expect(stockfetch.prices.GOOG).to.be.eql('625.77002');
	});

	// 17. 解析成功后调用打印报告
	it('parsePrice shoud call printReport', function () {
		var printReportMock 
			= sandbox.mock(stockfetch).expects('printReport');
		
		stockfetch.parsePrice('GOOG', data);

		printReportMock.verify();
	});


	// 18. 获取股票价格失败后存储到错误收集器
	it('processError should update errors', function () {
		stockfetch.processError('GOOG', '...oops...');

		expect(stockfetch.errors.GOOG).to.be.eql('...oops...');
	});

	// 19. 获取股票价格失败后调用打印报告
	it('processError shoud call printReport', function () {
		var printReportMock = sandbox.mock(stockfetch).expects('printReport');

		stockfetch.processError('GOOG', '...oops...');

		printReportMock.verify();
	});

	// 19. 接收到所有响应后，printReport返回价格或者错误信息
	it('printReport should send price, errors once all responses arrive', function () {
		stockfetch.prices = {
			'GOOG': '12.34'
		};
		stockfetch.errors = {
			'GOOG': '...oops...'
		}
		stockfetch.tickersCount = 2;

		var execPrintReportMock
			= sandbox.mock(stockfetch)
							 .expects('execPrintReport')
							 .withArgs([['GOOG', '12.34']], [['GOOG', '...oops...']]);
		
		stockfetch.printReport();

		execPrintReportMock.verify();
	});

	// 20. 没有接收到所有响应，则不打印
	it('printReport should not send before all responses arrive', function () {
		stockfetch.prices = {
			'GOOG': '12.34'
		};
		stockfetch.errors = {
			'GOOG': '...oops...'
		}
		stockfetch.tickersCount = 3;

		var execPrintReportMock = sandbox.mock(stockfetch)
			.expects('execPrintReport')
			.never();

		stockfetch.printReport();

		execPrintReportMock.verify();
	});

	// 21. printReport调用sortData，一次为prices，另一次为errors
	it('printReport should call sortData once for prices, once for errors', function () {
		stockfetch.prices = {
			'GOOG': '12.34'
		};
		stockfetch.errors = {
			'GOOG': '...oops...'
		}
		stockfetch.tickersCount = 2;

		var mock = sandbox.mock(stockfetch);
		mock.expects('sortData').withArgs(stockfetch.prices);
		mock.expects('sortData').withArgs(stockfetch.errors);

		stockfetch.printReport();

		mock.verify();
	});

	// 22. sortData根据股票代码对数据进行排序
	it('sortData should sort the data based on symbols', function () {
		var dataToSort = {
			'GOOG': '12.34',
			'AAPL': '43.21'
		}

		var result = stockfetch.sortData(dataToSort);

		expect(result).to.be.eql([['AAPL', '43.21'], ['GOOG', '12.34']]);
	});

	// 23. 集成测试-访问错误
	it('getPriceForTickers should report error for invalid file', function (done) {
		var onError = function (error) {
			expect(error).to.be.eql('Error reading file: InvalidFile');
			done();
		}

		var display = function () {};

		stockfetch.getPriceForTickers('InvalidFile', display, onError);
	});

	// 24. 集成测试-验证集成函数正确绑定了用来显示价格和错误信息的回调函数
	it('getPriceForTickers should response well for a valid file', function (done) {
		var onError = sandbox.mock().never();

		var display = function (prices, errors) {
			expect(prices.length + errors.length).to.be.eql(5);
			// expect(prices.length).to.be.eql(4);
			// expect(errors.length).to.be.eql(1);
			onError.verify();
			done();
		}

		this.timeout(10000);

		// 注意路径以package.json所在目录开始
		stockfetch.getPriceForTickers('./mixedTickers.txt', display, onError);
	});
});
