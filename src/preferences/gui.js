"use strict";
const electron = require('electron');
window._ = require('lodash');
window.$ = require('jquery');
window.angular = require('angular');
const config = require('./src/config');


angular.module('preferences', [])

.controller('AccountsCtrl', function($scope) {
  $scope.data = {
    acctId: null
  }

  $scope.accounts = config.accounts;
  highlightFirstAccount();

  $scope.addAccount = function() {
    let acct = {
      id: Math.random().toString(16).substring(2),
      label: "New Account"
    }
    $scope.accounts.push(acct);
    $scope.data.acctId = acct.id;
  }

  $scope.deleteAccount = function() {
    let acct = getAccount();
    if (acct && confirm(`Really delete ${acct.label}?`)) {
      _.remove($scope.accounts, (_acct) => _acct.id === acct.id);
      highlightFirstAccount()
    }
  }

  function getAccount() {
    return _.findWhere($scope.accounts, { id: $scope.data.acctId });
  }

  function highlightFirstAccount() {
    if ($scope.accounts.length === 0) {
      $scope.data.acctId = null;
    } else {
      $scope.data.acctId = $scope.accounts[0].id
    }
  }
})

