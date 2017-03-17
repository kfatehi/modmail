const { app } = require('electron');

const sumValues = (o)=> Object.keys(o).reduce((a, k)=>a+o[k], 0);

module.exports.init = function(prefix, config, ipc, _appConfig, sharedState) {
  ipc.on('notify-set-unread-count', (event, count)=>{
    sharedState[prefix] = count;
    app.setBadgeCount(sumValues(sharedState));
  });
  ipc.on('notify-new-mail', () => {
    console.log(prefix+' new mail');
  });
}
