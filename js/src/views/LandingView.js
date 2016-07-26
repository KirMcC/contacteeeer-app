'use strict';

//Loading dependencies
var Backbone = require('backbone');
var GridView = require('./GridView');
var FilterView = require('./FilterView');
var dataStore = require('../utils/dataStore');

module.exports = Backbone.View.extend({

    //Set the view div el with following class name
    className: 'js-landing-page',

    //Template called during rendering
    template: require('../templates/landingView.hbs'),

    /**
     * The landingView template is set to element.
     * Instantiate the gridView passing the collection and el object.
     * The el method the key finds the js-grid-view class.
     * Render dosen't need el as it's already passed through.
     *
     *@return {object} - This views reference
     */
    render: function() {

        this.$el.html(this.template());

        this.gridView = new GridView({
            el: this.$el.find('.js-grid-view')
        });

        this.filterView = new FilterView({
            el: this.$el.find('.js-filter-view'),
            model: dataStore.filter
        });

        this.filterView.render();
        this.gridView.render();
        return this;
    },

    /**
     * Disposes this view when called by an event listener called from
     * AppView on change page.
     *
     *@return {object} - this views reference
     */
    dispose: function() {
        this.gridView.length = 0;
        this.gridView.dispose();

        this.filterView.length = 0;
        this.filterView.dispose();

        return this.remove();
    }

});
