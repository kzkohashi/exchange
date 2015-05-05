var _exports = {};

var deployVersionId;

_exports.setDeployVersionId = function(id){
  deployVersionId = id;
}

_exports.css = function(path, options){
  return getTags(path, options, "<link rel='stylesheet' href='{s}' {attr} media='screen' />");
}

_exports.js = function(path, options){
  return getTags(path, options, "<script type='text/javascript' src='{s}' {attr}></script>");
}

_exports.img = function(path, options){
  if(options == undefined){
    options = {};
  }
  options.cache = false;
  options.lookImageUrl = true;
  return getTags(path, options, "<img src='{s}' {attr} />");
}


/*
* private
*/
function getTags(path, options, format) {
    var attr = '';
    var paths = [];
    if (path instanceof Array) {
        paths = path;
    } else {
        paths.push(path);
    }

    return paths.map(function(path) {
        var s;
        if (options && options.lookImageUrl) {
            s = config.local.imageUrl + path;
        } else {
            s = 'http://localhost:3000' + path;
        }
        return format.replace('{s}', s).replace('{attr}', attr);
    }).join('\n');
}

module.exports = {
  loader : _exports
};