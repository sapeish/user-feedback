process.env.NODE_ENV = 'test';

const sinon     = require('sinon');
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const sinonChai = require("sinon-chai");
chai.use(chaiHttp);
chai.use(sinonChai);
const config    = require('../../../../config/config');
const datastore = require('../../../../engine/datastore');
const expect    = chai.expect;

//to mock
const mysqlDS   = require('../../../../engine/datastore/mysqlDS');

let sandbox = null;

describe('session.mysql.it', () => {
    before(function (done) {
        config.set('app:datastore', 'mysql');
        config.set('app:validationMode', 'permissive');
        datastore.loadConfigs();
        setTimeout(function(){
            done();
        }, 1000);
    });
    beforeEach(function(done) {
        //remove all entries
        mysqlDS.resetData(done);
    });
    beforeEach(function () {
        sandbox = sinon.createSandbox()
    });
    afterEach(function () {
        sandbox.restore()
    });
    after(function (done) {
        //remove all entries
        mysqlDS.resetData(done);
    });

    it('should create and return a Session from MySql DS', (done) => {
        //--GIVEN-------------------------------------------------------------------------------------------------------
        let sessionId = "it-session-1001";
        let session = {
            "id": sessionId,
            "gameId": 'it-some-game-id'
        };

        //--WHEN--------------------------------------------------------------------------------------------------------
        let responseCreate = null;
        let responseExists = null;
        let runAll = async function() {
            responseCreate = await mysqlDS.createSession(session);
            responseExists = await mysqlDS.existsSession(session);
        };
        runAll().then(function () {
            //--THEN----------------------------------------------------------------------------------------------------
            expect(responseCreate).to.equal(sessionId);
            expect(responseExists).to.equal(true);
            done();
        })
    });

});
