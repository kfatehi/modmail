# Modmail

This is a Gmail wrapper with extreme moddability. It's a lot like Mailplane except that it's open source, crossplatform, and built with Electron.

Note that Modmail is quite unpolished when it comes to user interface and other niceties. The primary goal was the design of a plugin system ("mods"), the primary one of which is PGP support. For something far more polished, check out [wmail](http://thomas101.github.io/wmail/). I support this because it, too, is open source, crossplatform. Conveniently it is also built with electron. I may even start contributing there and deprecate Modmail, so do check it out!

![](/../screenshots/screenshots/main.png?raw=true)

## Features

* Modding engine
* Multiple accounts
* Inbox App support

## Config

Modmail expects `~/.modmail.config.js` to exist with a list of accounts. Each account can optoinally take a list of mods.

```js
module.exports = {
  accounts: [{
    id: 'personal', // used to persist the session. omit special characters/spaces

    label: "Personal", // what to display on the tab for this session

    // choose whatever mods you'd like to use, and configure them if necessary
    mods: [
      { id: 'my-mod', config: { /* modules can take configs */ } },
    ]
  },{
    id: 'business',
    label: "Business",
    app: "inbox", // can be "mail" for normal gmail, or "inbox". actually translates to https://${app}.google.com so you can probably use it for calendar and stuff too, but i have not tried that
    mods: [
      // you can also develop your own mods, just specify the path
      // development is easy. use the Reload and Inspector features to build mods quickly
      // tip: I find the fastest worfklow is to hit Ctrl-R/Cmd-R to from within the injected inspector to refresh without having to re-open the inspector
      { id: 'my-mod', path: 'path/to/project' }
    ]
  }],
}
```

## Included Mods

### pgp

* Decrypt emails
* Encrypt emails


```js
'use strict';
const readFile = (fp) => require('fs').readFileSync(fp).toString();
{
  id: 'pgp',
  config: {
    identity: {
      passphrase: () => readFile("/path/to/file/with/passphrase").trim(),
      privateKey: () => readFile('/path/to/file/with/private.key')
    },
    recipients: [{
      emails: [
        "keyvanfatehi@gmail.com",
        "kfatehi@uci.edu"
      ],
      publicKey: () => readFile('/path/to/pubkeys/keyvan.fatehi.key')
    },{
      emails: [
        "john.smith@gmail.com",
        "johnsmith1989@gmail.com"
      ],
      publicKey: () => readFile('/path/to/pubkeys/john.smith.key')
    }]
  }
}
```

This module modifies your gmail user interface, giving you the ability to encrypt and decrypt.

![](/../screenshots/screenshots/encrypt.png?raw=true)

![](/../screenshots/screenshots/decrypt.png?raw=true)

### autologin

* Automatic login by filling fields and submitting form
* Rate limited to prevent triggering captcha and security issues
* Detects captcha and gives user a chance to enter it and sign in

```js
{
  id: 'autologin',
  config: {
    email: "kfatehi@gmail.com",
    password: "super-secret"
  }
}
```

### notify

* Sets the Dock icon badge to the cumulative number of unread messages across all accounts for which it is enabled (macOS & Ubuntu/Unity only)
* Desktop notification for every new email

```js
{ id: 'notify' }
```

### adblock

* uses CSS to block the ads at the top of the inbox that pretend to be emails

```js
{ id: 'adblock' }
```

## Module Anatomy

Every module is composed of 3 components: **main-process**, **embedder**, and **injection**

Gmail itself runs in an electron `<webview>` embedded by the **embedder**. See `index.html` to view the embedder's DOM.

The webview is preloaded with the core **injection** which subsequently injects each module's injection component.

Most of the time you can do all the work in the injection component. Sometimes, this is unsafe. In these cases, we must use the IPC facilities provided by Electron.

For example, the `pgp` mod uses IPC to sends ciphertext to the embedder where it is then relayed by IPC to the main process.

The main process attempts to decrypt the ciphertext and then IPC's back the way it came until it replaces the DOM.

We do this because we don't want the private key anywhere near the wild web code. Using IPC, we can bring the ciphertext to the key instead of bringing the key to the ciphertext where it might be at risk.

## Developing Mods

To develop your own module, add it to your config using the `path` key. Make sure to set an `id` key too so that your ipc prefix is setup correctly. See the existing mods in the `src/mods` directory for examples of the three components.

As you edit your embedder and injection components, you can hit CMD-R (Ctrl-R on Windows and Linux) to reload! You can also open the inspector (see the View menu for the hotkey) to see your embedder and injection developer tools!

If you edit any main-process code, though, you will need to restart the process, but this should be pretty rare as most of the brute force is in the injection code.

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
