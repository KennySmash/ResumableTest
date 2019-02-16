'use strict';

module.exports = function(dataFromCall, varToTally, callback) {
  var contents = dataFromCall.Contents;
  for(var i=0;contents.length > i;i++){
      varToTally += contents[i].Size;
      console.log('Tally Ran', varToTally);
  }
  callback(varToTally);
};
