const { ipcMain } = require('electron');

module.exports = {
  // this value scopes IPC calls of this mod and account combination.
  // it's necessary because all main-process components for all mods
  // are loaded into the same (main) process.
  genIpcPrefix:  (account, mod) => `${account.id}.${mod.id}.`,

  // ipcProxy is a convenience API that allows you to
  // perform IPC w/o concern for the prefix
  genIpcProxy: (prefix)=> {
    return {
      on: (evName, handler)=> {
        return ipcMain.on(prefix+evName, (ev, ...args)=>{
          const send = (n, ...a) => {
            return ev.sender.send(prefix+n, ...a);
          };
          const customEv = Object.assign({}, ev, { send });
          handler(customEv, ...args);
        });
      }
    }
  }
}
