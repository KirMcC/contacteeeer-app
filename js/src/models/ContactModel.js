'use strict';

//Loading dependencies
var Backbone = require('backbone');

module.exports = Backbone.Model.extend({

    parse: function(response) {
        if (response.gender && typeof(response.gender) === 'string') {
            response.gender = response.gender.toLowerCase();
            response.gender = response.gender.charAt(0).toUpperCase() + response.gender.slice(1);
        }

        return response;
    },

    /**
    *
    * When adding a new contact or editing a contact, a validation check needs
    * to be done on the data, before updating or saving to the contactModel.
    *
    *@param {object} attrs - form input value attributes.
    *@param {object} options - options to pass for set or save.
    *@return {array} - set of errors to display on form.
    *
    */
    validate: function(attrs) {
        var errors = [];
        var re = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

        if (!attrs.firstName || typeof(attrs.firstName) !== 'string') {
            errors.push({name: 'firstName', message: 'Please enter a first name'});
        }

        if (!attrs.lastName || typeof(attrs.lastName) !== 'string') {
            errors.push({name: 'lastName', message: 'Please enter a last name'});
        }

        if (!attrs.jobTitle || typeof(attrs.jobTitle) !== 'string') {
            errors.push({name: 'jobTitle', message: 'Please enter a job title'});
        }

        if (attrs.gender !== 'Male' && attrs.gender !== 'Female') {
            errors.push({name: 'gender', message: 'Please select either Male or Female'});
        }

        if (!attrs.email || !re.test(attrs.email)) {
            errors.push({name: 'email', message: 'Please enter a valid email address'});
        }

        return errors.length > 0 ? errors : null;
    }
});
