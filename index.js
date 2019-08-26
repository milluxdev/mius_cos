var COS = require('cos-nodejs-sdk-v5');
var path = require('path');
var config = require('./config');
var fs = require('fs');

var cos = new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
    FileParallelLimit: 3, // 控制文件上传并发数
    ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
    ChunkSize: 1024 * 1024 * 8, // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
    Proxy: '',
});
var filename = 'config.js';
var filepath = path.resolve(__dirname, filename);
console.log(filepath)
cos.putObject({
    Bucket: config.Bucket,
    Region: config.Region,
    Key: 'win32/'+filename,
    /* 必须 */
    onTaskReady: function (tid) {
        TaskId = tid;
    },
    onProgress: function (progressData) {
        console.log(JSON.stringify(progressData));
    },
    Body: fs.createReadStream(filepath),
    ContentLength: fs.statSync(filepath).size
});