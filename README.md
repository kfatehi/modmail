# Modmail

This is a Gmail wrapper with extreme moddability. It's a lot like Mailplane except that it's open source, crossplatform, and built with Electron.

## Features

* Modding engine
* Multiple accounts

## Config

Modmail expects `~/.modmail.config.js` to exist with following semantics:

```js
module.exports = {
  accounts: [{
    id: 'personal', // used to persist the session. omit special characters/spaces

    label: "Personal", // what to display on the tab for this session

    // choose whatever mods you'd like to use, and configure them if necessary
    mods: [
      { id: 'gpg', config: { /* modules can take configs */ } }
    ]
  },{
    id: 'business',
    label: "Business",
    mods: [
      // you can also develop your own mods, just specify the path
      // development is easy. use the Reload and Inspector features to build mods quickly
      { id: 'my-mod', path: 'path/to/project' }
    ]
  }],
}
```

## Included Modules

### gpg

Features:
* Decrypt GPG emails

Wishlist:
* Encrypt emails
* Encrypted Attachments

This module requires a **config**. Example module block:

```js
{
  id: 'gpg',
  config: {
    getSecrets: (cb) => {
      let spawn = require("child_process").spawn;
      let passphrase = "my secret phrase";
      let email = "example@gmail.com";
      spawn('/usr/local/bin/gpg', ['--export-secret-key', '-a', email])
      .stdout.on('data', (buf) => { cb(null, [buf.toString(), passphrase]) });
    }
  }
}
```

## Module Anatomy

Every module is composed of 3 components: **main-process**, **embedder**, and **injection**

Gmail itself runs in an electron `<webview>` embedded by the core **embedder**. See `index.html` to view the embedder's DOM.

The webview is preloaded with the core **injection** which subsequently injects each module's injection component.

Most of the time you can do all the work in the injection component. Sometimes, this is unsafe. In these cases, we must use the IPC facilities provided by Electron.

For example, the `gpg` mod uses IPC to sends ciphertext to the embedder where it is then relayed by IPC to the main process.

The main process attempts to decrypt the ciphertext and then IPC's back the way it came until it replaces the DOM.

We do this because we don't want the private key anywhere near the wild web code. Using IPC, we can bring the ciphertext to the key instead of bringing the key to the ciphertext where it might be at risk.

## Developing Modules

To develop your own module, add it to your config using the `path` key. Make sure to set an `id` key too so that your ipc prefix is setup correctly. See the `gpg` module in the `src` directory for examples of each component.

PR your mods back here so everyone can benefit!

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/kfatehi/modmail
# Go into the repository
$ cd modmail
# Install dependencies and run the app
$ npm install && npm start
```

Learn more about Electron and its API in the [documentation](http://electron.atom.io/docs/latest).

#### License [CC0 (Public Domain)](LICENSE.md)
