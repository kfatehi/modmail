const { app } = require('electron');

const sumValues = (o)=> Object.keys(o).reduce((a, k)=>a+o[k], 0);

module.exports.init = function(prefix, config, ipc, _appConfig, sharedState, mainWindow) {
  ipc.on('notify-set-unread-count', (event, count)=>{
    sharedState[prefix] = count;
    app.setBadgeCount(sumValues(sharedState));
  });

  ipc.on('new-mail-notification-clicked', () => {
    mainWindow.show();
    // TODO open the correct tab... even the correct email?
  });
}
