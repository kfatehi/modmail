"use strict";

module.exports.init = (tools) => {

  var config = tools.getModConfig('autologin')

  var app = window.location.host.split('.')[0]

  var form;

  if ( app === "accounts" ) {
    form = $('form.RFjuSb');
    console.log('found form');
  } else {
    form = $('form#gaia_loginform');
  }


  performAutologin(app, form, config.email, config.password);
}

function performAutologin(app, form, email, password) {
  if (form.length === 0) {
    return false;
  }

  let getTries = () =>
    parseInt(localStorage['modmail-autologin-tries']) || 0

  let setTries = (num) => 
    localStorage['modmail-autologin-tries'] = num

  let incrementTries = () => setTries(getTries + 1)

  var maxtries = 2;


  if (getTries() < maxtries) {
    // we are at the login form!
    console.log('autologin');
    if ( app === "accounts" ) {
      form.find('input[name=password]').val(password);
      console.log('filled passwd');
    } else {
      form.find('input#Email').val(email);
      form.find('input#Passwd').val(password);
    }

    if ($('input#logincaptcha').length === 1) {
      alert('solve the captcha and sign in');
    } else {
      if ( app === "accounts" ){
        form.find('#passwordNext').get(0).click()
      } else {
        form.submit();
      }
    }

  } else {
    localStorage['modmail-autologin-tries'] = 0;
    alert('too many attempts');
  }
}
