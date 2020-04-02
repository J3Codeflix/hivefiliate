import React from 'react'
import $ from 'jquery'

export default function jquery(props) {
	$( document ).ready(function() {
        $('.shapes-box').removeClass("moveparticle");
        $('body').scroll(function(){
            var scroll = $('body').scrollTop();
            if (scroll > 100) {
                $('.hive-navigation').addClass("navscrolling");
                $('.buttonnav').removeClass("black");
                $('.buttonnav').addClass("teal");
                $('.hivelogotop1').addClass("tlogo1");
                $('.hivelogotop2').removeClass("tlogo2");

            }
            else{
                $('.hive-navigation').removeClass("navscrolling");
                $('.buttonnav').addClass("black");
                $('.buttonnav').removeClass("teal");
                $('.hivelogotop1').removeClass("tlogo1");
                $('.hivelogotop2').addClass("tlogo2");
            }

            $('.shapes-box').addClass("moveparticle");

        });




				$("a.scroll").click(function(event) {
						event.preventDefault();
						$("html, body").animate({scrollTop: $($(this).attr('href')).offset().top}, 500);
				});



    });

}
