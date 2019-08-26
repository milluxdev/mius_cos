var COS = require('cos-nodejs-sdk-v5');
var path = require('path');
var config = require('./config');
var fs = require('fs');
var jsyaml = require('js-yaml');
var cos = new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey,
    FileParallelLimit: 3, // 控制文件上传并发数
    ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数，在同园区上传可以设置较大的并发数
    ChunkSize: 1024 * 1024 * 8, // 控制分片大小，单位 B，在同园区上传可以设置较大的分片大小
    Proxy: '',
});
var yml_file = 'latest.yml'
var content = fs.readFileSync(yml_file,{encoding:"utf8"});
var result = jsyaml.load(content);
var filename = result.files[0].url;
var blockmap = result.files[0].url+'.blockmap';
var filepath = path.resolve(__dirname, filename);
var blockmap_path = path.resolve(__dirname, blockmap);
var yml_path = path.resolve(__dirname, yml_file);
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
cos.putObject({
    Bucket: config.Bucket,
    Region: config.Region,
    Key: 'win32/'+yml_file,
    /* 必须 */
    onTaskReady: function (tid) {
        TaskId = tid;
    },
    onProgress: function (progressData) {
        console.log(JSON.stringify(progressData));
    },
    Body: fs.createReadStream(yml_path),
    ContentLength: fs.statSync(yml_path).size
});
cos.putObject({
    Bucket: config.Bucket,
    Region: config.Region,
    Key: 'win32/'+blockmap,
    /* 必须 */
    onTaskReady: function (tid) {
        TaskId = tid;
    },
    onProgress: function (progressData) {
        console.log(JSON.stringify(progressData));
    },
    Body: fs.createReadStream(blockmap_path),
    ContentLength: fs.statSync(blockmap_path).size
});