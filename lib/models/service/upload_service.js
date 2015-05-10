
// third party
var async = require('async');
var _ = require('underscore');
var config = require('config');
var AWS = require('aws-sdk');
var fs = require('fs');

// util
var validator = require('util/validator');

var UploadService = function() {
    this.name = 'upload_service';
}

UploadService.prototype.fileUpload = function(params, callback) {
    try {
        validator.has(params, ['filePath', 'fileType', 'fileName']);
        validator.string(params.filePath);
        validator.string(params.fileType);
        validator.string(params.fileName);

        validator.function(callback);
    } catch (error) {
        callback(error);
        return;
    }

    AWS.config.update({
        accessKeyId: config.get('s3.accessKeyId'),
        secretAccessKey: config.get('s3.secretAccessKey'),
        region: config.get('s3.region')
    });
    var s3 = new AWS.S3();

    fs.stat(params.filePath, function(error, fileInfo) {
        if (error) {
            callback(error);
            return;
        }
        var readStream = fs.createReadStream(params.filePath);
        s3.putObject({
            Bucket: config.get('s3.bucket'),
            Key: params.fileName,
            ContentType: params.fileType,
            ContentLength: fileInfo.size,
            Body: readStream
        }, callback);
    });
}

var service = new UploadService();
module.exports = service;
