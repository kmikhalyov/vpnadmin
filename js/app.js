(function($,window) {
  var pageHandlers = {};
  var pages = {};
  var currentPage;

  // show the "page" with optional parameter
  function show(pageName, param) {
    // invoke page handler
    var ph = pageHandlers[pageName];
    if (ph) {
      var $page = $("div#" + pageName);
      // call "page" handler
      ph.call( $page.length ? $page[0] : null, param );
    }
    // activate the page  
    $(".nav li.active").removeClass("active");
    $(".nav li a[href=#" + pageName + "]").closest("li").addClass("active");

    $(document.body)
      .attr("page", pageName)
      .find("div.page").addClass('hidden')
      .filter("div#" + pageName).removeClass("hidden");
  }

  // "page" loader
  function app(pageName,param) {
    var $page = $(document.body).find("div#" + pageName);  
    var src = '/pages/' + pageName + '.html';
    if ($page.find(">:first-child").length == 0) {
      // is empty - load it
      $.get(src, "html").done(function(html){
        currentPage = pageName; $page.html(html); show(pageName,param);
      }).fail(function() {
        $page.html("failed to get:" + src);
      });
    } else {
      show(pageName,param);
    }
  }

  // register page handler  
  app.handler = function(pageName, handler) {
    var $page = $(document.body).find("div#" + pageName);
    pageHandlers[pageName] = handler.call($page[0]);
  };

  app.getHandler = function(pageName) {
    return pageHandlers[pageName];
  };

  app.getPageHandler = function(pageName) {
    if (!app.pages[pageName]) {
      app.pages[pageName] = $.pageName({});
    }
  };

  function onhashchange() {
    var hash = location.hash || "#companies";
    var re = /#([-0-9A-Za-z]+)(\:(.+))?/;
    var match = re.exec(hash);
    hash = match[1];
    var param = match[3];
    // navigate to the page
    app(hash,param);
  }

  $(window).on('hashchange', onhashchange);
  // setup the app as global object
  window.app = app; 
  // initial state setup
  $(function(){
    $(window).trigger('hashchange');
  });
})(jQuery,this);