var COS = require('cos-nodejs-sdk-v5');
var path = require('path');
var config = require('./config');
var fs = require('fs');
var jsyaml = require('js-yaml');
var content = fs.readFileSync("./latest.yml",{encoding:"utf8"});
var result = jsyaml.load(content);
console.log(result.files[0].url)