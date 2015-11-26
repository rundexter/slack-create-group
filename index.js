var _ = require('lodash');
var SlackClient = require('slack-api-client');

var authKey = 'slack_api_key';

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
    slackMain: function (authOptions, params, callback) {
        var slack = new SlackClient(authOptions);

        // Follow befriended
        slack.api.groups.create(params, callback);
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
     * Get Auth options from Environment.
     *
     * @param dexter
     * @returns {*}
     */
    authOptions: function (dexter) {
        // slack auth property
        var authOptions = {};

        if(dexter.environment(authKey)) {
            // get auth property
            return dexter.environment(authKey);
        } else {
            // catch no-arguments message
            this.fail('A ' + authKey + ' environment variable is required for this module');

            return false;
        }
    },

    /**
     * Allows the authenticating users to follow the user specified in the ID parameter.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {

        this.slackMain(this.authOptions(dexter), step.inputs(), function (error, apiResult) {
            if (error) {
                // if error - send message
                this.fail(error);
            }
            // return befriendedInfo
            this.complete(this.pickResult(apiResult));
        }.bind(this));
    }
};
