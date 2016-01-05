$(document).ready(function() {
  var switched = false;
  var updateTables = function() {
    if (($(window).width() < 767) && !switched ){
      switched = true;
      $("table.js-zurb-responsive").each(function(i, element) {
        splitTable($(element));
      });
      return true;
    }
    else if (switched && ($(window).width() > 767)) {
      switched = false;
      $("table.js-zurb-responsive").each(function(i, element) {
        unsplitTable($(element));
      });
    }
  };
   
  updateTables();
  addFadeToEdges();
  $(window).on("redraw",function(){switched=false;updateTables();}); // An event to listen for
  $(window).on("resize", function(){updateTables(); addFadeToEdges();});
   
	
	function splitTable(original)
	{
		original.wrap("<div class='table-wrapper' />");
		
		var copy = original.clone();
		copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
		copy.removeClass("js-zurb-responsive");
		
		original.closest(".table-wrapper").append(copy);
		copy.wrap("<div class='pinned' />");
		original.wrap("<div class='scrollable' />");

    setCellHeights(original, copy);
	}
	
	function unsplitTable(original) {
    original.closest(".table-wrapper").find(".pinned").remove();
    original.unwrap();
    original.unwrap();
	}

  function setCellHeights(original, copy) {
    var tr = original.find('tr'),
        tr_copy = copy.find('tr'),
        heights = [];

    tr.each(function (index) {
      var self = $(this),
          tx = self.find('th, td');

      tx.each(function () {
        var height = $(this).outerHeight(true);
        heights[index] = heights[index] || 0;
        if (height > heights[index]) heights[index] = height;
      });

    });

    tr_copy.each(function (index) {
      $(this).height(heights[index]);
    });
  }
  
  function addFadeToEdges() {
  	$(".scrollable").each(function(i, element) {
		var scrollWidth = $(element).prop('scrollWidth');
		var eleWidth = $(element).width();
		var scrollRight = scrollWidth - eleWidth;
	  
		if ( scrollWidth > eleWidth ) {
			$(element).addClass('faderight');
		  
			$(element).on('scroll' ,function(){
				if ( $(element).scrollLeft() == 0 ) { $(element).removeClass('fadeleft'); }
				if ( $(element).scrollLeft() > 0 ) { $(element).addClass('fadeleft'); }
				if ( $(element).scrollLeft() == scrollRight  ||  $(element).scrollLeft() == (scrollRight-1) ) { $(element).removeClass('faderight');}
				if ( $(element).scrollLeft() != scrollRight  &&  $(element).scrollLeft() != (scrollRight-1) ) { $(element).addClass('faderight');}
			});
			  
		} else {
			//Remove fading from each edge as div isn't scrollable
			$(element).removeClass('faderight')
					  .removeClass('fadeleft');
		}
	});
  }

});
