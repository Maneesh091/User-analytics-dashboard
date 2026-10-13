(function () {
  // Backend URL script tag ke data-api se aayega
  var API = (document.currentScript &&
             document.currentScript.getAttribute('data-api')) ||
            'http://localhost:5000/api/events';

  // Session id: localStorage me ek baar banao, phir wahi use karo
  function getSessionId() {
    var id = localStorage.getItem('analytics_session_id');
    if (!id) {
      id = 'sess_' + (crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2));
      localStorage.setItem('analytics_session_id', id);
    }
    return id;
  }

  function send(type, extra) {
    var payload = Object.assign({
      session_id: getSessionId(),
      type: type,
      page_url: location.origin + location.pathname,
      timestamp: new Date().toISOString(),
    }, extra || {});

    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(function () {});
  }

  // page_view: script load hote hi
  send('page_view');

  // click: poore document par ek listener
  document.addEventListener('click', function (e) {
    send('click', {
      x: e.pageX,
      y: e.pageY,
      page_width: document.documentElement.scrollWidth,
      page_height: document.documentElement.scrollHeight,
    });
  });
})();