var Stockfetch = require('./stockfetch');

var onError = function (error) {
	console.log(error);
}

var display = function (prices, errors) {
	var print = item => {
		console.log(`${item[0]}\t${item[1]}`);
	};

	console.log('prices for ticker symbols: ');
	prices.forEach(print);
	
	console.log('Ticker symbols with errors: ');
	errors.forEach(print);
}

var stockfetch = new Stockfetch();
stockfetch.getPriceForTickers('mixedTickers.txt', display, onError);