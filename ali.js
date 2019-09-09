let OSS = require('ali-oss');
let path = require('path');
let fs = require('fs');
let jsyaml = require('js-yaml');
let arg = process.argv.splice(2);
let accessKeyId = arg[0]
let accessKeySecret = arg[1]
let bucket = arg[2]
let region = arg[3]
let dir = arg[4]
let client = new OSS({
    "accessKeyId": accessKeyId,
    "accessKeySecret": accessKeySecret,
    "bucket": bucket,
    "region": region
  });
client.useBucket(bucket);
let yml_file = 'latest.yml'
let content = fs.readFileSync(yml_file,{encoding:"utf8"});
let result = jsyaml.load(content);
let filename = result.files[0].url;
let blockmap = result.files[0].url+'.blockmap';
let filepath = path.resolve(__dirname, filename);
let blockmap_path = path.resolve(__dirname, blockmap);
let yml_path = path.resolve(__dirname, yml_file);
async function list () {
    try {
      let result = await client.list()
      console.log(result)
    } catch (err) {
      console.log (err)
    }
  }
  async function put (name,path) {
    try {
      let result = await client.put(dir + '/' + name, path);
      console.log(result);
     } catch (err) {
       console.log (err);
     }
  }
  put(filename,filepath);
  put(yml_file,yml_path);
  put(blockmap,blockmap_path);
  list();