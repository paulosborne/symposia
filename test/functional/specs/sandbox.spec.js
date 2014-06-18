/* global Symposia */
describe('Sandbox', function () {
    var sym = new Symposia();
    var box = sym.sandbox.create('example');
    var sub = {};

    describe('subscribe()', function () {

        before(function () {
            sub.channel = 'inbox';
            sub.topic =  'my.subscription';
            sub.callback = sinon.spy();

            box.subscribe(sub);
        });

        it('should create a new cache entry', function () {
            var subs = box.subscriptions();

            subs.should.have.property(sub.channel);
            subs[sub.channel].should.have.members([sub.topic]);
        });

        it('should create a new subscription', function () {
            var subs = sym.sandbox.getSubscriptions();

            subs.should.have.property(sub.channel);
            subs[sub.channel].should.have.property(sub.topic);
            subs[sub.channel][sub.topic].should.have.property(box.id);
        });

        after(function () {
        });

    });

    describe('publish()', function () {
        before(function () {
            box.publish({
                 channel: sub.channel,
                 topic: sub.topic,
                 data: {
                    message: "hello"
                 }
            });
        });

        it('should execute the callback', function () {
            sub.callback.called.should.be.true;
        });

        it('should execute with the correct arguments', function () {
            var args = sub.callback.args[0];

            args.should.have.length(2);
            args[0].should.have.property('message');
            args[1].should.have.keys('channel','topic','data','timeStamp');
        });

        after(function () {
        });
    });

    describe('unsubscribe()', function () {
        before(function () {
            box.unsubscribe({
                channel: sub.channel,
                topic: sub.topic
            });
        });

        it('should remove the subscription', function () {
            var subs = sym.sandbox.getSubscriptions();

            subs[sub.channel][sub.topic].should.not.have.property(box.id);
        });
    
    });
});
