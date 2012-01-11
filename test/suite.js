var assert = require('assert'),
    http = require('http');

describe('Basic Suite', function() {
    var keyToSet = 'bingo',
        valueToSet = 'the dog';
    describe('#set()', function() {
        it('should save without error', function(done) {

            client.set(keyToSet, valueToSet, done);

        });
    });

    describe('#get()', function() {
        it('should be able to get the value we set', function(done) {

            client.get(keyToSet, function(err, data) {
                should.not.exist(err);
                data.should.equal(valueToSet);
                done();
                
            });
        });
    });
});
