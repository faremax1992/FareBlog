var clearUtil = function(app){

};
clearUtil.clearXMLTags = function(str, deeply){
  var deeply = deeply || false;
  var temp = str.replace(/<[^>]+>/g, '');
  if(deeply){
    temp = temp.replace(/[\r\n][\r\n]+/g, '');
  }
  return temp;
};
clearUtil.clearScripts = function(str){
  return str.replace(/<script>.*?<\/script>/ig,'');
};
clearUtil.clearReturns = function(str){
  return str.replace(/[\r\n]/g, '');
};
clearUtil.TransferTags = function(str){
  var temp = str.concat();
  temp = temp.replace(/</g, '&lt;');
  temp = temp.replace(/>/g, '&gt;');
  return temp;
};

module.exports = clearUtil;

