var sandbox;

beforeEach(function () {
	sandbox = sinon.createSandbox();
});

afterEach(function () {
	sandbox.restore();
});