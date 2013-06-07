var should;

require.config({
    baseUrl: '../',
    paths: {
        'symposia':'dist/symposia',
        'chai': 'node_modules/chai/chai',
        'sinonChai': 'node_modules/sinon-chai/lib/sinon-chai'
    }
});

require(['chai','sinonChai'], function ( chai, sinonChai ) {
    window.chai = chai;
    window.expect = chai.expect;
    window.assert = chai.assert;
    window.should = chai.should();
    window.sinonChai = sinonChai;
    window.notrack = true;

    chai.use(sinonChai);
    mocha.setup('tdd');

    require([
        'test/specs/all.spec'
    ], function () {
        mocha.run();
    });

}, function ( err ) {
    console.log ( err );
});
