// --------------------------------------------------------------------------------------------------------------------
//
// sqs.js - class for AWS SQS
//
// Copyright (c) 2011 AppsAttic Ltd - http://www.appsattic.com/
// Written by Andrew Chilton <chilts@appsattic.com>
//
// License: http://opensource.org/licenses/MIT
//
// --------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------
// requires

// built-ins
var util = require('util');

// dependencies
var _ = require('underscore');

// our own
var awssum = require('awssum');
var amazon = require('awssum-amazon');
var operations = require('./config.js');

// --------------------------------------------------------------------------------------------------------------------
// package variables

var MARK = 'sqs: ';

// From: http://docs.amazonwebservices.com/general/latest/gr/rande.html
var endPoint = {};
endPoint[amazon.US_EAST_1]      = "sqs.us-east-1.amazonaws.com";
endPoint[amazon.US_WEST_1]      = "sqs.us-west-1.amazonaws.com";
endPoint[amazon.US_WEST_2]      = "sqs.us-west-2.amazonaws.com";
endPoint[amazon.EU_WEST_1]      = "sqs.eu-west-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_1] = "sqs.ap-southeast-1.amazonaws.com";
endPoint[amazon.AP_SOUTHEAST_2] = "sqs.ap-southeast-2.amazonaws.com";
endPoint[amazon.AP_NORTHEAST_1] = "sqs.ap-northeast-1.amazonaws.com";
endPoint[amazon.SA_EAST_1]      = "sqs.sa-east-1.amazonaws.com";
endPoint[amazon.US_GOV_WEST_1]  = "sqs.us-gov-west-1.amazonaws.com";

var version = '2012-11-05';

// --------------------------------------------------------------------------------------------------------------------
// constructor

var Sqs = function(opts) {
    var self = this;

    // call the superclass for initialisation
    Sqs.super_.call(this, opts);

    // check the region is valid
    if ( ! endPoint[opts.region] ) {
        throw MARK + "invalid region '" + opts.region + "'";
    }

    // check we have an awsAccountId
    if ( ! opts.awsAccountId ) {
        throw MARK + "provide a 'awsAccountId'";
    }
    self.setAwsAccountId(opts.awsAccountId);

    return self;
};

// inherit from Amazon
util.inherits(Sqs, amazon.AmazonSignatureV4);

// --------------------------------------------------------------------------------------------------------------------
// methods we need to implement from awssum.js/amazon.js

Sqs.prototype.host = function() {
    return endPoint[this.region()];
};

Sqs.prototype.version = function() {
    return version;
};

// --------------------------------------------------------------------------------------------------------------------
// AWS Signature v4

Sqs.prototype.scope = function() {
    return 'sqs';
}

Sqs.prototype.needsTarget = function() {
    return false;
}

Sqs.prototype.contentType = function() {
    return 'application/x-amz-json-1.0';
};

// --------------------------------------------------------------------------------------------------------------------
// operations on the service

_.each(operations, function(operation, operationName) {
    Sqs.prototype[operationName] = awssum.makeOperation(operation);
});

// --------------------------------------------------------------------------------------------------------------------
// exports

exports.Sqs = Sqs;

// --------------------------------------------------------------------------------------------------------------------
