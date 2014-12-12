//this gallery sort is actually for the second database sorting exercise. It happened to be the one I did first. Sorry for the confusion.
// <![CDATA[
var imageNames = 
['sh01_1923_a043_MagazineAd.jpg', 'sh01_1924_a045_MagazineAd.jpg', 'sh01_1925_e006_poster.jpg', 'sh01_1925_e008_poster.jpg', 'sh01_1925_e015_AdDesign.jpg', 
'sh01_1926_e019_poster.jpg', 'sh01_1926_e020_poster.jpg', 'sh01_1927_c002_poster.jpg', 'sh01_1927_c004_poster.jpg', 'sh01_1927_c006_poster.jpg', 
'sh01_1927_c007_poster.jpg', 'sh01_1927_c008_poster.jpg', 'sh01_1927_c010_poster.jpg', 'sh01_1927_c011_poster.jpg', 'sh01_1927_e030_poster.jpg', 
'sh01_1930_c017_poster.jpg', 'sh01_1932_c023_poster.jpg', 'sh01_1933_c030_poster.jpg', 'sh01_1933_c031_poster.jpg', 'sh01_1933_c032_poster.jpg', 
'sh01_1933_c033_poster.jpg', 'sh01_1933_c034_poster.jpg', 'sh01_1933_c037_poster.jpg', 'sh01_1933_c038_poster.jpg', 'sh01_1933_c039_poster.jpg', 
'sh01_1933_c042_MagazineAd.jpg', 'sh01_1933_e038_poster.jpg', 'sh01_1933_e039_poster.jpg', 'sh01_1936_c043_MagazineAd.jpg', 'sh01_1936_d006_no1167_MagAd.jpg', 
'sh01_1936_e041_poster.jpg', 'sh01_1937_c049_MagazineAd.jpg', 'sh01_1937_c050_MagazineAd.jpg', 'sh01_1937_c052_MagazineAd.jpg', 'sh01_1937_e043_poster.jpg', 
'sh01_1937_e044_poster.jpg', 'sh01_1938_c054_poster.jpg', 'sh01_1938_c056_poster.jpg', 'sh01_1939_c058_MagazineAd.jpg', 'sh01_1939_c061_MagazineAd.jpg', 
'sh01_1939_d009_3_MagAd.jpg', 'sh01_1939_d010_7_MagAd.jpg', 'sh01_1939_d011_10_MagAd.jpg', 'sh01_1940_d013_5_MagAd.jpg', 'sh01_1940_d014_6_MagAd.jpg', 
'sh01_1940_d015_7_MagAd.jpg', 'sh01_1940_e045_poster.jpg', 'sh01_1906_a013_MagazineAd.jpg', 'sh01_1914_a018_MagazineAd.jpg', 'sh01_1916_a021_MagazineAd.jpg', 
'sh01_1917_a022_MagazineAd.jpg', 'sh01_1922_a038_MagazineAd.jpg']; //list of image names to be messed with.

function refresh(){
	//everytime a tag is inserted or removed, call this to refresh what is shown. Most efficient way?
	//Get values of checkboxes. Go through everyone in a for loop with vjxCounter ids? if it has any of the checked ones, keep it, otherwise hide it.
	var blushcheck = $('#blushbox').prop('checked');
	var eyecheck = $('#eyebox').prop('checked');
	var curvecheck = $('#curvebox').prop('checked');
	var camcheck = $('#cambox').prop('checked');
	var reccheck = $('#recbox').prop('checked');
	var nonecheck = $('#nonebox').prop('checked');
	$('.vjxContainer').each(function(){
		if(!blushcheck && $(this).hasClass('blush')){
			$(this).fadeOut();
		}
		else if(!eyecheck && $(this).hasClass('eye')){
			$(this).fadeOut();
		}
		else if(!curvecheck && $(this).hasClass('curve')){
			$(this).fadeOut();
		}
		else if(!camcheck && $(this).hasClass('cam')){
			$(this).fadeOut();
		}
		else if(!reccheck && $(this).hasClass('rec')){
			$(this).fadeOut();
		}
		else if(!nonecheck && !($(this).hasClass('blush') || $(this).hasClass('eye') || $(this).hasClass('curve') || $(this).hasClass('cam') || $(this).hasClass('rec'))){
			$(this).fadeOut();
		}
		else{
			$(this).fadeIn();
		}
	});
}

$(document).ready(function(){
	var vjxCounter = 0;
	for(i in imageNames){
		$('#vjxMain').append("<div class='vjxContainer' id='" + vjxCounter + "'><img src='https://files.edx.org/vjx/adSort/" + imageNames[i].slice(0,-4) + "_200.jpg'></div>");
		vjxCounter += 1;
	}
	$('#blushbox, #eyebox, #curvebox, #cambox, #recbox, #nonebox').prop('checked', true); //everything should be checked visible to begin with
	//but if any of them get checked/unchecked, need to change. Use on click? Try it.
	$('#blushbox, #eyebox, #curvebox, #cambox, #recbox, #nonebox').on('click',function(){
		refresh();
	});

	$('.vjxContainer').hover(function(){
		//put on the overlay
		$(this).prepend("<div id='overlay'><div id='zoomblock'><img src='https://files.edx.org/vjx/vjxZoomIcon.png'/></div><div id='blushtag'>Blush</div><div id='eyetag'>Eyes</div><div id='curvetag'>S-Curve</div><div id='camtag'>Camellia</div><div id='rectag'>Reclining</div></div>");
		//I think things that need to happen on any of the above hovers have to happen here.
		//start with zooming?
		$('#zoomblock img').hover(function(){
			//animate a zoomy zoom!
			$(this).stop(); //keep the animations from stacking
			$(this).animate({'width': '55px', 'height': '55px'},100);
			$('#zoomblock').on('click',function(){
				$('#lightbox').remove();
				//get image somehow, go up and back down.
				var toZoom = $(this).parents('.vjxContainer').children('img').attr('src'); //got it!
				//open a lightbox? Sure, let's do that.
				$('#vjxMain').prepend("<div id='lightbox'>Click to Close<img src='" + toZoom.slice(0,-8) + ".jpg'/></div>");
				$('#lightbox').on('click',function(e){
					//if lightbox is open and you click somewhere, close it. Prevent defaults?
					$('#lightbox').remove();
				});	
			});
		}, function(){
			$(this).stop(); //keep the animations from stacking
			$(this).animate({'width': '48px', 'height': '48px'},100);
		});
		//
		//pretty label hover animation
		$('#blushtag, #eyetag, #curvetag, #camtag, #rectag').hover(function(){
			$(this).css('color','black');
		},function(){
			$(this).css('color','white');
		});
		//need a generic function to add the label
		$('#blushtag, #eyetag, #curvetag, #camtag, #rectag').click(function(){
			var id = $(this).attr('id').slice(0,-3);
			//add classes to indicate that it is labelled and which label it is. Toggle if it's already there. Let other labels be.
			$(this).parents('.vjxContainer').toggleClass(id);
			//add pretty label tab based on right css color, size, absolute location.
			//first kill it if it is already there
			var checkClass = "." + $(this).attr('id');
			if($(this).parents('.vjxContainer').children(checkClass).length){ //how to test if element exists: Does it have a length?
				$(this).parents('.vjxContainer').children(checkClass).animate({'width':'62px'},100,function(){$(this).parents('.vjxContainer').children().remove(checkClass);});
			}
			else{
				var newLabel = "<div class='" + $(this).attr('id') + "'></div>";
				//the above makes a new div with the class x-tag instead of the id x-tag. Both have been given the same css, but only the id will ever animate, and the class is wider
				//now add it to the container
				$(this).parents('.vjxContainer').append(newLabel);
				$(this).parents('.vjxContainer').children(checkClass).animate({'width':'92px'},100);
			}
			refresh(); //refresh page proper
		});
	},function(){
		$(this).children('#overlay').remove();
	});
});
// ]]>