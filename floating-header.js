;
(function() {
  angular.module('floatingHeaders',[])
    .directive('floatingHeader', ['$window', floatingHeaders])

  function floatingHeaders($window) {
    return function(scope, element, attributes) {
      /* bootstrap ============================================================================== */
      var local = {};
      var opts = scope.$eval(attributes.floatingHeader) || {};
      var cloned = local.$cloned = element.clone()

      cloned
        .addClass('floating-header')
        .css({
          position: 'fixed',
          top: 0,
          visibility: 'hidden',
          backgroundColor: opts.bgColor||'white',
          "z-index": 1
        })

      element.after(cloned);

      /* re-initialize on the 'float-header' event ============================================== */
      scope.$on('float-header', init);

      init();

      function init() {
        local.$table = angular.element(element[0].offsetParent);
        local.$cells = element.find('th')
        local.$clonedCells = cloned.find('th');
        local.offsetTop = local.$table[0].offsetTop + (local.$table[0].offsetParent||{}).offsetTop || 0;
        local.isIE = !!element[0].runtimeStyle
        syncWidths();
      }


      /* scroll & resize handler ================================================================ */
      $window.onscroll = $window.onresize = handler

      function handler() {
        var tblHeight = local.$table[0].offsetHeight
        var scrollTop = $window.pageYOffset;
        var inTableRegion = scrollTop > local.offsetTop && scrollTop < local.offsetTop + tblHeight;
        /* sync the th cells */
        syncWidths();
        /* make sure the widths of the thead (or tr) match */
        local.$cloned[0].style.width = getComputedStyle(element[0]).width

        if (inTableRegion) cloned.css('visibility', 'visible');
        else cloned.css('visibility', 'hidden');
      }

      /* private ================================================================================ */
      function syncWidths() { // The original and the clone have to have their widths in sync
        angular.forEach(local.$clonedCells, function(cell, ix) {
          var computed = getComputedStyle(local.$cells[ix]);

          if(!local.isIE) {
            cell.style.width = computed.width
          }
          else {
            var width = +computed.width.replace('px', '');
            var paddingLeft = +(computed.paddingLeft.replace('px', '')||0);
            var paddingRight = +(computed.paddingRight.replace('px', '')||0);
            var borderLeftWidth = +(computed.borderLeftWidth.replace('px', '')||0);
            var borderRightWidth = +(computed.borderRightWidth.replace('px', '')||0);
            cell.style.width = width + paddingRight + paddingLeft + borderLeftWidth + borderRightWidth + 'px'
          }


        })
      }


    }
    /* ========================================================================================== */
  }
}());


