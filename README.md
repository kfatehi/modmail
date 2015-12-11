# Modmail

This is a Gmail wrapper with extreme moddability. I built it in reaction to mailplane's decision to rest on their laurels.

Anyone with some javascript skills can create their own mods by creating the appopriate files under `src/mods`. See the `gpg` module for examples.

## Config

Configuration is done by a Javascript file in your Home directory. Example:

```js
module.exports = {
  // setup the tabs, each one persists its own session
  // each one has its own mods
  accounts: [{
    id: 'personal',
    label: "Personal",
    mods: [
      { id: 'gpg' }
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

**Secret File**

You need to create a javascript file `$HOME/.gpg-secret.js` similar to this example:

```js
var spawn = require("child_process").spawn;

var name = 'Keyvan Fatehi';
var passphrase = "my super secret passphrase i unfortunately put in a file!"

// callback sig: (error, [key, passphrase])
module.exports = function(cb) {
  spawn('gpg', ['--export-secret-key', '-a', name]).stdout.on('data', function(buf) {
    cb(null, [buf.toString(), passphrase]);
  });
}
```

## Module Anatomy

Every module is composed of 3 components: **main-process**, **embedder**, and **injection**

Gmail itself runs in an electron `<webview>` embedded by the core **embedder**. See `index.html` to view the embedder's DOM.

The webview is preloaded with the core **injection** which subsequently injects each module's injection component.

You can require modules and do most things in each type of environment, in practice though, we find logical places to put certain logic.

As a result, we need to communicate between these components. Electron makes this easy by providing IPC facilities all the way through. You can see examples of this in the `gpg` mod which actually sends ciphertext through the embedder to the main process where it is actually decrypted into plaintext. The plaintext is then IPC'd through the embedder and into the injection where it replaces the actual text on the DOM. We do this because we don't want our private key anywhere near Gmail's code, so we bring the ciphertext to it instead of the other way around.

## Adding a Module

To add a module, add it to your config using the `path` key. See the `gpg` module in the `src` directory for an example.

PR your mods back here so everyone can benefit!

## Wishlist

* Markdown support

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
