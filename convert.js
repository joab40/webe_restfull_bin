function appendObjTo(thatArray, newObj) {
  const frozenObj = Object.freeze(newObj);
  return Object.freeze(thatArray.concat(frozenObj));
}

var inputfile = 'devices.yaml',
    outputfile = 'devices.json',
    yaml = require('js-yaml'),
    fs = require('fs'),
    obj = yaml.load(fs.readFileSync(inputfile, {encoding: 'utf-8'}));
    var datat = JSON.stringify(obj)

    console.log(`Restfull found returned hid: ` + obj.hasOwnProperty("1"))
    const values = Object.keys(obj)
    let total = [];
    values.forEach(element => {
    total = appendObjTo(total, obj[element]);
     })
     console.log(total)

fs.writeFileSync(outputfile, JSON.stringify(obj, null, 2));