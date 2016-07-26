'use strict';

// Load dependencies.
var ContactModel = require('../../src/models/ContactModel');

/**
* When called check if the response is an array/object
* test for length of response,
* test if the response contains an equal key name
*
*@param {object} response - the validation response.
*@param {string} keyName - the keyname matching type of validation
*
*/
var testErrorResponse = function(response, keyName) {
    expect(typeof(response)).to.equal('object');
    expect(response.length).to.equal(1);
    expect(response[0].name).to.equal(keyName);
};

//Start the test
describe('ContactModel: ', function() {

    /**
    *
    * Set an object containing dummy data to create a new contactModal
    * before each test block.
    *
    */
    beforeEach(function() {
        this.fullData = {
            firstName: 'Mike',
            lastName: 'McWilson',
            jobTitle: 'Roads Service',
            gender: 'male',
            email: 'mcwilson@mcroads.com'
        };
    });

    /********
    * TESTS *
    *********/

    it('should uppercase the first letter of the gender', function() {
        this.fullData.gender = 'female';

        var myModel = new ContactModel(this.fullData, {parse: true});
        expect(myModel.get('gender')).to.equal('Female');
    });

    it('should require a first name', function() {
        this.fullData.firstName = '';

        var myModel = new ContactModel(this.fullData, {parse: true});
        var validationResponse = myModel.validate(myModel.attributes);

        testErrorResponse(validationResponse, 'firstName');
    });

    it('should require a last name', function() {
        this.fullData.lastName = '';

        var myModel = new ContactModel(this.fullData, {parse: true});
        var validationResponse = myModel.validate(myModel.attributes);

        testErrorResponse(validationResponse, 'lastName');
    });

    it('should require a jobTitle', function() {
        this.fullData.jobTitle = '';

        var myModel = new ContactModel(this.fullData, {parse: true});
        var validationResponse = myModel.validate(myModel.attributes);

        testErrorResponse(validationResponse, 'jobTitle');
    });

    it('should accept a gender of male', function() {
        var myModel = new ContactModel(this.fullData, {parse: true});
        var validationResponse = myModel.validate(myModel.attributes);

        expect(validationResponse).to.equal(null);
    });

    it('should accept a gender of female', function() {
        this.fullData.gender = 'Female';

        var myModel = new ContactModel(this.fullData, {parse: true});
        var validationResponse = myModel.validate(myModel.attributes);

        expect(validationResponse).to.equal(null);
    });

    it('should reject any gender other than male or female', function() {
        this.fullData.gender = 'n/a';

        var myModel = new ContactModel(this.fullData, {parse: true});
        var validationResponse = myModel.validate(myModel.attributes);

        testErrorResponse(validationResponse, 'gender');
    });

    it('should accept a valid email', function() {
        var myModel = new ContactModel(this.fullData, {parse: true});
        var validationResponse = myModel.validate(myModel.attributes);

        expect(validationResponse).to.equal(null);
    });

    it('should reject a valid email', function() {
        this.fullData.email = '';

        var myModel = new ContactModel(this.fullData, {parse: true});
        var validationResponse = myModel.validate(myModel.attributes);

        testErrorResponse(validationResponse, 'email');

        this.fullData.email = 'vshdfjhe';

        var myModel = new ContactModel(this.fullData, {parse: true});
        var validationResponse = myModel.validate(myModel.attributes);

        testErrorResponse(validationResponse, 'email');
    });

});
