var _ = require('lodash');
var SlackClient = require('slack-api-client');

var pickResult = {
    'ok': 'ok',
    'group.id' : 'group_id',
    'group.name': 'group_name',
    'group.latest': 'group_latest'
};

module.exports = {
    /**
     * Run main twitter function.
     *
     * @param authOptions
     * @param params
     * @param callback
     */
    slackMain: function (params, callback) {
        var slack = new SlackClient(params.token);

        // Follow befriended
        slack.api.groups.create(_.omit(params, 'token'), callback);
    },

    /**
     * Return pick result.
     *
     * @param output
     * @returns {*}
     */
    pickResult: function (output) {
        var result = {};

        _.map(_.keys(pickResult), function (val) {

            if (_.has(output, val)) {

                _.set(result, pickResult[val], _.get(output, val));
            }
        });

        return result;
    },

    /**
     * Allows the authenticating users to follow the user specified in the ID parameter.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {

        this.slackMain(step.inputs(), function (error, apiResult) {
            if (error) {
                // if error - send message
                this.fail(error);
            }
            // return befriendedInfo
            this.complete(this.pickResult(apiResult));
        }.bind(this));
    }
};
