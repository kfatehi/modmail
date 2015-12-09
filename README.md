# gpg-gmail-electron

This is a Gmail wrapper.

Features:
* Decrypt GPG emails

## Requirements

You need to create a javascript file `$HOME/.gpg-secret.js` similar to this example:

    var spawn = require("child_process").spawn;

    var name = 'Keyvan Fatehi';
    var passphrase = "my super secret passphrase i unfortunately put in a file!"

    // callback sig: (error, [key, passphrase])
    module.exports = function(cb) {
      spawn('gpg', ['--export-secret-key', '-a', name]).stdout.on('data', function(buf) {
        cb(null, [buf.toString(), passphrase]);
      });
    }

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/atom/electron-quick-start
# Go into the repository
$ cd electron-quick-start
# Install dependencies and run the app
$ npm install && npm start
```

Learn more about Electron and its API in the [documentation](http://electron.atom.io/docs/latest).

#### License [CC0 (Public Domain)](LICENSE.md)
