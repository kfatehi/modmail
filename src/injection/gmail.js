module.exports = function($) {
  var api = { dom: {}, tools: {} };

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

  api.dom.messageContainers = function() {
    return $('.G2.G3')
  }

  api.dom.extractMessageFromContainer = function(messageContainer) {
    return messageContainer.find('.adP.adO > div')
  }

  api.tools.add_modal_window = function(title, content_html, onClickOk, onClickCancel, onClickClose) {
    var remove = function() {
      $('#gmailJsModalBackground').remove();
      $('#gmailJsModalWindow').remove();
    };
    
    // By default, clicking on cancel or close should clean up the modal window
    onClickClose = onClickClose || remove;
    onClickCancel = onClickCancel || remove;
    onClickOk = onClickOk || remove;
    
    var background = $(document.createElement('div'));
    background.attr('id','gmailJsModalBackground');
    background.attr('class','Kj-JD-Jh');
    background.attr('aria-hidden','true');
    background.attr('style','opacity:0.75;width:100%;height:100%;');
    
    // Modal window wrapper
    var container = $(document.createElement('div'));
    container.attr('id','gmailJsModalWindow');
    container.attr('class', 'Kj-JD');
    container.attr('tabindex', '0');
    container.attr('role', 'alertdialog');
    container.attr('aria-labelledby', 'gmailJsModalWindowTitle');
    container.attr('style', 'left:50%;top:50%;opacity:1;');
    
    // Modal window header contents
    var header = $(document.createElement('div'));
    header.attr('class', 'Kj-JD-K7 Kj-JD-K7-GIHV4');
    
    var heading = $(document.createElement('span'));
    heading.attr('id', 'gmailJsModalWindowTitle');
    heading.attr('class', 'Kj-JD-K7-K0');
    heading.attr('role', 'heading');
    heading.html(title);
    
    var closeButton = $(document.createElement('span'));
    closeButton.attr('id', 'gmailJsModalWindowClose');
    closeButton.attr('class', 'Kj-JD-K7-Jq');
    closeButton.attr('role', 'button');
    closeButton.attr('tabindex', '0');
    closeButton.attr('aria-label', 'Close');
    closeButton.click(onClickClose);
    
    header.append(heading);
    header.append(closeButton);
    
    // Modal window contents
    var contents = $(document.createElement('div'));
    contents.attr('id', 'gmailJsModalWindowContent');
    contents.attr('class', 'Kj-JD-Jz');
    contents.html(content_html);
    
    // Modal window controls
    var controls = $(document.createElement('div'));
    controls.attr('class', 'Kj-JD-Jl');
    
    var okButton = $(document.createElement('button'));
    okButton.attr('id', 'gmailJsModalWindowOk');
    okButton.attr('class', 'J-at1-auR J-at1-atl');
    okButton.attr('name', 'ok');
    okButton.text('OK');
    okButton.click(onClickOk);
    
    var cancelButton = $(document.createElement('button'));
    cancelButton.attr('id', 'gmailJsModalWindowCancel');
    cancelButton.attr('name', 'cancel');
    cancelButton.text('Cancel');
    cancelButton.click(onClickCancel);
    
    controls.append(okButton);
    controls.append(cancelButton);
    
    container.append(header);
    container.append(contents);
    container.append(controls);
    
    $(document.body).append(background);
    $(document.body).append(container);
    
    var center = function() {
      container.css({
        top: ($(window).height() - container.outerHeight()) / 2,
        left: ($(window).width() - container.outerWidth()) / 2
      });
    };
    
    center();
    
    $(window).resize(center);
  }
  return api
}
