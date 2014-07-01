(function($) {
    $.fn.floatHeaders = function(options) {

        if (!this.length) {return this;}

        var opts = $.extend(true, {}, $.fn.floatHeaders.defaults, options);
        var style = '<style id="floatHeader-style">.floatingHeader{position: fixed;top: 0;visibility: hidden;background-color:' + opts.backgroundColor + ';}</style>';
        // remove floating header if already exists
        $(".floatingHeader").remove();
        // remove style if it exists
        $("#floatHeader-style").remove(); 
        $('head').append(style);

        // Instead of recalculating on resize, we trigger the custom event 'resizeEnd'
        // after the window has stopped changing for 300ms. 
        $(window).resize(function() {
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(function() {
                $(this).trigger('recalculateHeaders');
            }, 300);
        });
        
        function getFloatingHeader($table) {

            var clonedHeader = $table.find('.floating-header')
            var tblWidth = $table.css("width");
            clonedHeader
                .before(clonedHeader.clone())
                .css("width", tblWidth)
                .addClass("floatingHeader");

            // Set the appropriate <th> widths
            $floater = $('.floatingHeader', $table);
            $floatingHeaderCells = $floater.find('th');

            if (opts.startRow > 1) {
                $tableHeaderCells = $table.find('tr:nth-child(' + opts.startRow + ')').not('.floatingHeader').find('th')
            } else {
                $tableHeaderCells = $table.find('thead tr').not('.floatingHeader').find('th')
            }

            $floatingHeaderCells.each(function(index) {
                $($floatingHeaderCells[index]).css('width', $($tableHeaderCells[index]).css('width'))
            });
        }

        function scrollFunction($table, tblHeight, offsetTop) {
            var $floater = $('.floatingHeader', $table);
            var scrollTop = $(window).scrollTop();
            if ((scrollTop > offsetTop) && (scrollTop < offsetTop + tblHeight)) {
                $floater.css("visibility", "visible");
            } else {
                $floater.css("visibility", "hidden");
            }
        }

        this.each(function() {

            /// Initialization. These vars don't change
            var $table = $(this).addClass("floating-table");
            var $header = $table.find('thead tr').addClass("floating-header");
            if ($header.length == 0) {
                var $header = $table.find('tr:nth-child(' + opts.startRow + ')').addClass("floating-header");
            }
            var tblHeight = $table.height();
            var offsetTop = $table.offset().top;
            getFloatingHeader($table);

            /// Bind the recalculation of the header to the customer resizeEnd event
            $(window).bind('recalculateHeaders', function() {
                $table.find('.floatingHeader').remove();
                getFloatingHeader($table)
            })

            // This function executes while scrolling to determine whether or not 
            // the floating header row needs to be visible
            $(window).scroll(function() {
                scrollFunction($table, tblHeight, offsetTop)
            }).trigger("scroll");


        });
        
        
        return this
    };

    // default options
    $.fn.floatHeaders.defaults = {
        backgroundColor: 'white',
        startRow: 1
    };



})(jQuery);
