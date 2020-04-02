import React from 'react'
import $ from 'jquery'

export default function jquery(props) {
	$( document ).ready(function() {

	    $(".sidebar-dropdown > a").click(function(e) {
  		  $(".sidebar-submenu").slideUp(200);
  		  if($(this).parent().hasClass("active")) {
  		    $(".sidebar-dropdown").removeClass("active");
  		    $(this).parent().removeClass("active");

  		  } else {

  		    $(".sidebar-dropdown").removeClass("active");
  		    $(this).next(".sidebar-submenu").slideDown(200);
  		    $(this).parent().addClass("active");
  		  }

  		  e.preventDefault();
		});

    /*$(".dashboard-wrapper").removeClass("toggled");

	    $("#close-sidebar").click(function() {
	      $("#show-sidebar").show();
	      $("#close-sidebar").hide();
		  $(".dashboard-wrapper").addClass("toggled");
		});
		$("#show-sidebar").click(function() {
		  $("#show-sidebar").hide();
		  $("#close-sidebar").show();
		  $(".dashboard-wrapper").removeClass("toggled");
		});*/

	});
}
