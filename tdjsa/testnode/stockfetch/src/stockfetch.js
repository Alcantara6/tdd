var fs = require('fs');
var http = require('http');

class Stockfetch {
	
	constructor(count) {
		this.http = http;
		this.tickersCount = count;
		// 每支股票的价格/错误信息
		this.prices = {};
		this.errors = {};
	}

	// last: 集成测试
	getPriceForTickers(fileName, displayFn, onErrorFn) {
		this.execPrintReport = displayFn;
		this.readTickersFile(fileName, onErrorFn);
	}
	
	// 第一个测试
	// readTickersFile(fileName, onError) {
	// 	onError('Error reading file: ' + fileName);
	// }

	// 正向测试
	readTickersFile(fileName, onError) {
		var processResponse = (err, data) => {
			if (err) {
				onError('Error reading file: ' + fileName);
			}
			else {
				var tickers = this.parseTickers(data.toString());
				if (!tickers.length) {
					onError(`File ${fileName} has invalid content`);
				}
				else {
					this.processTickers(tickers);
				}
			}
		}
		
		fs.readFile(fileName, processResponse);
	}

	parseTickers(tickers) {
		var isInRightFormat = function (str) {
			return str.trim().length && !str.includes(' ');
		}
		return tickers.split('\n').filter(isInRightFormat);
	}

	processTickers(tickers) {
		this.tickersCount = tickers.length;
		tickers.forEach(ticker => {
			this.getPrice(ticker);
		})
	}

	getPrice(symbol) {
		var url = `http://ichart.finance.yahoo.com/table.csv?s=${symbol}`;
		this.http.get(url, this.processResponse.bind(this, symbol))
						 .on('error', this.processHTTPError.bind(this, symbol));
	}

	processResponse(symbol, response) {
		if (response.statusCode === 200) {
			var data = '';
			response.on('data', chunk => {
				data += chunk;
			});
			response.on('end', () => {
				this.parsePrice(symbol, data);
			});
		}
		else {
			this.processError(symbol, response.statusCode);
		}
	}

	parsePrice(ticker, data) {
		var price = data.split('\n')[1].split(',').pop();
		this.prices[ticker] = price;
		this.printReport();
	}

	processHTTPError(ticker, error) {
		this.processError(ticker, error.code);
	}

	processError(ticker, errorCode) {
		this.errors[ticker] = errorCode;
		this.printReport();
	}

	printReport() {
		if (Object.keys(this.prices).length + Object.keys(this.errors).length === this.tickersCount) {
			this.execPrintReport(this.sortData(this.prices), this.sortData(this.errors));
		}
	}

	sortData(dataToSort) {
		var toArray = function (key) {
			return [key, dataToSort[key]];
		}
		return Object.keys(dataToSort).sort().map(toArray);
	}

	execPrintReport(prices, errors) {

	}
}

module.exports = Stockfetch;