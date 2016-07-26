'use strict';

//Loading dependencies
var Backbone = require('backbone');

/**
*
* The selectedFilterData stores an object containg the key name and value
* from filter selection {gender: 'Female'}.
*
* filterOptions sets the value for the first filter select box.
*
* filterGender sets the second filter select box, only for gender as
* department data is intergreted from collection.
*
*/

module.exports = Backbone.Model.extend({
    defaults: function() {
        return {
            selectedFilterData: {},
            filterOptions: {
                options: ['All', 'Gender', 'Job Title']
            },

            filterGender: ['Select Gender', 'Female', 'Male']
        };
    }
});
