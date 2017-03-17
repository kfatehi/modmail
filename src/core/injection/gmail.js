require('gmail-js'); // sets window.Gmail

module.exports = function($) {
  var api = Gmail();

  // some custom functions and/or overrides follow
  // these would be functions that should probably be
  // upstreamed to the gmail-js project eventually

  api.tools.add_menu_button = function(menu, label, onClickHandler) {
    var btn = $('<div>').click(onClickHandler.bind(btn))
    btn.attr('class', 'J-N J-Ks')
    btn.attr('role', 'menuitemcheckbox')
    btn.attr('aria-checked', "false")
    btn.attr('style', "-webkit-user-select: none;")
    btn.append(
      $('<div>').attr('class', "J-N-Jz").attr('style', "-webkit-user-select: none;")
      .append($('<div>').attr('class', "J-N-Jo").attr('style', "-webkit-user-select: none;"))
      .append(label)
    )
    var hoverClass = 'J-N-JT';
    btn.hover(function() {
      $(this).addClass(hoverClass)
    }, function() {
      $(this).removeClass(hoverClass)
    })
    $(menu).append(btn)
    return btn;
  }

  api.dom.messageBodies = function() {
    return $('.adP.adO > div')
  }

  api.dom.get_composer_recipients = function() {
    return $(".aXjCH").find('span[email]').map((e,i)=>$(i).attr('email')).toArray()
  }
  return api
}
