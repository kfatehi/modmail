"use strict";

module.exports.init = (tools) => {
  var form = $('form#gaia_loginform');

  if (form.length === 0) {
    return false;
  }
  var config = tools.getModConfig('autologin')

  performAutologin(form, config.email, config.password);
}

function performAutologin(form, email, password) {
  let getTries = () =>
    parseInt(localStorage['modmail-autologin-tries']) || 0

  let setTries = (num) => 
    localStorage['modmail-autologin-tries'] = num

  let incrementTries = () => setTries(getTries + 1)

  var maxtries = 2;


  if (getTries() < maxtries) {
    // we are at the login form!
    form.find('input#Email').val(email);
    form.find('input#Passwd').val(password);

    if ($('input#logincaptcha').length === 1) {
      alert('solve the captcha and sign in');
    } else {
      form.submit();
    }

  } else {
    localStorage['modmail-autologin-tries'] = 0;
    alert('too many attempts');
  }
}
