require('gmail-js'); // accesible as window.Gmail

// custom gmail related functions follow
module.exports = function($) {
  var api = Gmail();

  api.tools.addButtonToContainer = function(messageContainer, content_html, onClickFunction, styleClass) {
    var btn = $(document.createElement('div'));
    btn.attr('class','T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3 ')
    if (styleClass) btn.addClass(styleClass);
    btn.attr('role', 'button')
    btn.css({ '-webkit-user-select': 'none' });
    btn.html(content_html)
    btn.click(onClickFunction)
    messageContainer.find('td.gH.acX').prepend(btn);
    return btn;
  }

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
