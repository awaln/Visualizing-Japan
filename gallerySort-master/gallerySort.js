//this gallery sort is actually for the second database sorting exercise. It happened to be the one I did first. Sorry for the confusion.

var imageNames = 
['sh02_GR_1933_06_0111.jpg', 'sh02_GR_1933_07_0211.jpg', 'sh02_GR_1933_08_0312.jpg', 'sh02_GR_1933_09_0411.jpg', 'sh02_GR_1933_10_0511.jpg',
'sh02_GR_1934_01_0611.jpg', 'sh02_GR_1934_02_0711.jpg', 'sh02_GR_1934_03_0602.jpg', 'sh02_GR_1934_03_0811.jpg', 'sh02_GR_1934_04_0911.jpg',
'sh02_GR_1934_05_1012.jpg', 'sh02_GR_1934_06_1112.jpg', 'sh02_GR_1934_07_1211.jpg', 'sh02_GR_1934_08_1311.jpg', 'sh02_GR_1934_09_1411.jpg',
'sh02_GR_1934_10_1511.jpg', 'sh02_GR_1934_11_1611.jpg', 'sh02_GR_1934_12_1711.jpg', 'sh02_GR_1935_01_1811.jpg', 'sh02_GR_1935_02_1911.jpg',
'sh02_GR_1935_03_2011.jpg', 'sh02_GR_1935_04_2111.jpg', 'sh02_GR_1935_05_2211.jpg', 'sh02_GR_1935_06_2311.jpg', 'sh02_GR_1935_07_2411.jpg',
'sh02_GR_1935_08_2511.jpg', 'sh02_GR_1935_09_2614.jpg', 'sh02_GR_1935_10_2711.jpg', 'sh02_GR_1935_11_2811.jpg', 'sh02_GR_1935_12_2912.jpg',
'sh02_GR_1936_01_3011.jpg', 'sh02_GR_1936_02_3111.jpg', 'sh02_GR_1936_03_3211.jpg', 'sh02_GR_1936_04_3313.jpg', 'sh02_GR_1936_05_3411.jpg',
'sh02_GR_1936_06_3511.jpg', 'sh02_GR_1936_07_3612.jpg', 'sh02_GR_1936_08_3711.jpg', 'sh02_GR_1936_09_3812.jpg', 'sh02_GR_1936_10_3911.jpg',
'sh02_GR_1936_11_4012.jpg', 'sh02_GR_1936_12_4111.jpg', 'sh02_GR_1937_01_4212.jpg', 'sh02_GR_1937_02_4312.jpg', 'sh02_GR_1937_03_4411.jpg',
'sh02_GR_1937_04_4511.jpg', 'sh02_GR_1937_05_4611.jpg', 'sh02_GR_1937_06_4711.jpg', 'sh02_GR_1937_07_4812.jpg', 'sh02_GR_1937_08_4911.jpg',
'sh02_GR_1937_09_5011.jpg']; //list of image names to be messed with.

//convert to the actual location of those images inside img and div tags
//for edX, the /static/ location *should* be fine, but /static/ images don't work with ajax calls.
function nameToUrl(name){
	//return("<div class='vjxContainer' style='background-color:white;background-repeat:no-repeat;background-size:contain;width:200px;min-height:145px;
		//background-image:url("+name+")'></div>");
	return("<div class='vjxContainer'><img src='https://files.edx.org/vjx/shGR/" + name + "'/></div>");
}

function refresh(){
	//everytime a tag is inserted or removed, call this to refresh what is shown. Most efficient way?
	//Get values of checkboxes. Go through everyone in a for loop with vjxCounter ids? if it has any of the checked ones, keep it, otherwise hide it.
	var modcheck = $('#modbox').prop('checked');
	var tradcheck = $('#tradbox').prop('checked');
	var homecheck = $('#homebox').prop('checked');
	var cinecheck = $('#cinebox').prop('checked');
	var nonecheck = $('#nonebox').prop('checked');
	$('.vjxContainer').each(function(){
		if(!modcheck && $(this).hasClass('mod')){
			$(this).fadeOut();
		}
		else if(!tradcheck && $(this).hasClass('trad')){
			$(this).fadeOut();
		}
		else if(!homecheck && $(this).hasClass('home')){
			$(this).fadeOut();
		}
		else if(!cinecheck && $(this).hasClass('cine')){
			$(this).fadeOut();
		}
		else if(!nonecheck && !($(this).hasClass('trad') || $(this).hasClass('cine') || $(this).hasClass('home') || $(this).hasClass('mod'))){
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
		$('#vjxMain').append("<div class='vjxContainer' id='" + vjxCounter + "'><img src='https://files.edx.org/vjx/shGR/" + imageNames[i].slice(0,-4) + "_200.jpg'></div>");
		vjxCounter += 1;
	}
	$('#modbox, #tradbox, #homebox, #cinebox, #nonebox').prop('checked', true); //everything should be checked visible to begin with
	//but if any of them get checked/unchecked, need to change. Use on click? Try it.
	$('#modbox, #tradbox, #homebox, #cinebox, #nonebox').on('click',function(){
		refresh();
	});

	$('.vjxContainer').hover(function(){
		//put on the overlay
		$(this).prepend("<div id='overlay'><div id='zoomblock'><img src='https://files.edx.org/vjx/vjxZoomIcon.png'/></div><div id='modtag'>Modern Women</div><div id='tradtag'>Traditional and Cosmetics</div><div id='hometag'>Home</div><div id='cinetag'>Cinema and Montage</div></div>");
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
		$('#modtag, #tradtag, #hometag, #cinetag').hover(function(){
			$(this).css('color','black');
		},function(){
			$(this).css('color','white');
		});
		//need a generic function to add the label
		$('#modtag, #tradtag, #hometag, #cinetag').click(function(){
			var id = $(this).attr('id').slice(0,-3);
			//add classes to indicate that it is labelled and which label it is. Toggle if it's already there. Let other labels be.
			$(this).parents('.vjxContainer').toggleClass(id);
			//add pretty label tab based on right css color, size, absolute location.
			//first kill it if it is already there
			var checkClass = "." + $(this).attr('id');
			if($(this).parents('.vjxContainer').children(checkClass).length){ //how to test if element exists: Does it have a length?
				$(this).parents('.vjxContainer').children(checkClass).animate({'width':'140px'},100,function(){$(this).parents('.vjxContainer').children().remove(checkClass);});
			}
			else{
				var newLabel = "<div class='" + $(this).attr('id') + "'></div>";
				//the above makes a new div with the class x-tag instead of the id x-tag. Both have been given the same css, but only the id will ever animate, and the class is wider
				//now add it to the container
				$(this).parents('.vjxContainer').append(newLabel);
				$(this).parents('.vjxContainer').children(checkClass).animate({'width':'170px'},100);
			}
			refresh(); //refresh page proper
		});
	},function(){
		$(this).children('#overlay').remove();
	});
});