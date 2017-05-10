"use strict";

module.exports.init = (tools) => {
  const config = tools.getModConfig('autologin')

  const createStrategy = ({selector, steps}) => {
    let step = 0;
    const getElement = () => $(selector);
    const match = () => getElement().length > 0;
    const next = () => {
      steps[step](getElement(), config);
      step++;
    }
    return { match, next };
  }

  const defaultStrategies = [
    createStrategy({
      selector: 'form.RFjuSb',
      steps: [
        (form, {password}) => form.find('input[name=password]').val(password),
        form => form.find('#passwordNext').get(0).click()
      ]
    }),
    createStrategy({
      selector: 'form#gaia_loginform',
      steps: [
        (form, {email, password}) => {
          form.find('input#Email').val(email);
          form.find('input#Passwd').val(password);
        },
        form => form.submit()
      ]
    }),
    createStrategy({
      selector: 'form[name=login]',
      steps: [
        (form, {user, password}) => {
          form.find('input#user').val(user);
          form.find('input#password').val(password);
        },
        form => form.find('input[type=submit]').click()
      ]
    })
  ]

  const strategy = defaultStrategies.reduce((result, strat)=>{
    if (result) return result;
    else if (strat.match()) return strat;
  }, null);

  if (strategy)
    executeAutologinStrategy(strategy);
  else
    console.log('no autologin strategy matched');
}

function executeAutologinStrategy(strategy) {
  let getTries = () =>
    parseInt(localStorage['modmail-autologin-tries']) || 0

  let setTries = (num) => 
    localStorage['modmail-autologin-tries'] = num

  let incrementTries = () => setTries(getTries + 1)

  var maxtries = 2;

  if (getTries() < maxtries) {
    // we are at the login form!
    console.log('autologin');
    strategy.next();

    if ($('input#logincaptcha').length === 1) {
      alert('solve the captcha and sign in');
    } else {
      strategy.next();
    }

  } else {
    localStorage['modmail-autologin-tries'] = 0;
    alert('too many attempts');
  }
}
