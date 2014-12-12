var bsstimeline = (function() {

	var state = {
        'complete':0,
    	},
		channel;

    // Establish a channel only if this application is embedded in an iframe.
    // This will let the parent window communicate with this application using
    // RPC and bypass SOP restrictions.
    if (window.parent !== window) {
        channel = Channel.build({
            window: window.parent,
            origin: "*",
            scope: "JSInput"
        });

        channel.bind("getGrade", getGrade);
        channel.bind("getState", getState);
        channel.bind("setState", setState);
    }

	var vjxPage; //to have as a global variable for the current picture in the album.
	function openAlbum(div){ //input is a jQuery object of the div we care about. Treat div like $('.vjxDrag') instance, no new $ required.
		$('#vjxOverlay').remove();
		vjxPage = div;
		$('#vjxDragbox').append("<div id='vjxOverlay'><div id='vjxImage'><img src='" + div.children('.vjxThumb').attr('src').slice(0,-8) + ".jpg' style='max-width:100%; max-height:100%'/></div><img id='vjxLeft' onclick='turnPage(-1)' src='https://files.edx.org/vjx/left.png'/><img id='vjxRight' onclick='turnPage(1)' src='https://files.edx.org/vjx/right.png'/><p id='vjxClose' onclick='closeAlbum()'>[X] Click <br>to Close</p><div id='zoombox' style='display:inline-block; width:2%; height:35%'><img src='https://files.edx.org/vjx/plusw.png'/><input type='range' id='zoom' min='0' max='2' step='.01' orient='vertical' style='width: 100%; height: 75%; -webkit-appearance: slider-vertical; writing-mode: bt-lr;' onchange='updateZoom(value)'><img src='https://files.edx.org/vjx/minusw.png'/></div></div>"); //create the overlay. This is made to cover the avaliable space, and fixed so scrolling is ineffectual.
		//makes use of turnPage(change this value), closeAlbum(), updateZoom.
		$('#vjxImage > img').load(function(){
			$(this).attr('data-width',$(this).width());
			$(this).attr('data-height',$(this).height()); //grab original dimensions for zoom later
			$(this).css({'height':$(this).attr('data-height'), 'width':$(this).attr('data-width'), 'max-height':'','max-width':''});
			updateZoom(1);
		});
	}

	function turnPage(direction){
		//left calls this with -1, right calls it with +1
		var index = vjxPage.prevAll('.vjxDrag').length + 1; //which child it is. (starting with 1, not 0)
		index += direction //index of new div we want
		var limit = $('.vjxDrag').length //how long the list could possibly be
		if(index <= 0){
			index = limit; //wrap around to the end
		}
		else if(index > limit){
			index = 1; //go back to the front
		}
		openAlbum($('.vjxDrag:nth-of-type(' + index + ')'));
	}

	function closeAlbum(){
		$('#vjxOverlay').remove();
	}

	function updateZoom(zoomLevel){ //master zoom for the page, affects everything. All images are divs with background-image. It makes the hover highlight possible with just css rather than slower jquery.
		var height = $('#vjxImage > img').attr('data-height');
		var width = $('#vjxImage > img').attr('data-width'); //grab the actual dimensions from the html
		$('#vjxImage > img').css({'width':width*zoomLevel,'height':height*zoomLevel});
	}

	$(document).ready(function(){
		var images = ['76_097_WhaleShip.jpg','17_125a_Fumie.jpg','30_008a_fortytwolands.jpg','02_016a_Dejima.jpg','77_001_Manjiro.jpg','40_004_ships.jpg','06_012_Xavier.jpg']; //list of images to be used as draggables. No flavor text for assessments, 1:1 pictures to list size.
		var counter = 1;
		for(i=0;i<images.length;i++){ //append to vjxDrag as img inside div, not draggable yet
			if(Math.floor(Math.random()*2)===0){ //flip a coin
				$('#vjxDragbox').append("<div class='vjxDrag' id='drag" + counter + "'><img class='vjxThumb' src='https://files.edx.org/vjx/bss/" + images[i].slice(0,-4) + "_200.jpg'/></div>"); //src changes folder based on images.
			}
			else{
				$('#vjxDragbox').prepend("<div class='vjxDrag' id='drag" + counter + "'><img class='vjxThumb' src='https://files.edx.org/vjx/bss/" + images[i].slice(0,-4) + "_200.jpg'/></div>"); //src changes folder based on images.
			}
			counter++;
		}
		// $('.vjxDrag').hover(function(){ //on mousein
		// 	$(this).append("<img id='vjxZoomIcon' src='https://files.edx.org/vjx/vjxIconZoom.png'/>");
		// 	$('#vjxZoomIcon').hover(function(){ //on mousein
		// 		$(this).animate({'width':'57px','height':'57px'},200);
		// 		$(this).click(function(){ //on zoom button click
		// 			openAlbum($(this).parent());
		// 		});
		// 	}, function(){ //on mouseout
		// 		$(this).animate({'width':'52px','height':'52px'},200);
		// 	});
		// }, function(){ //on mouseout
		// 	$('#vjxZoomIcon').remove();
		// });
		$('.vjxDrag').draggable({ //this is to shrink the image when you drag it (so it fits in the #topbin) and re-embiggen it when you put it down
			containment:'document',
			revert:true,
			start:function(event,ui){
				$('#vjxZoomIcon').remove();
			}
		});
		$('.vjxdrop').droppable({
			drop:function(event,ui){
				if($(ui.draggable).attr('id').slice(-1) === $(this).attr('id').slice(-1)){ //if the drop and the image match, move the image and get rid of the drag property. Had to get rid of the words too since they won't hide underneath properly *mumblegrumble*
					$(this).append("<img src='" + $(ui.draggable).children('.vjxThumb').attr('src') + "'/>");
					$(ui.draggable).remove();
					$(this).children('p').remove();
					if($('.vjxDrag').length === 0){
						state.complete = 1;
						console.log('complete!');
					}
				}
				else{
					$(ui.draggable).css({'height':$(ui.draggable).css('height'),'width':$(ui.draggable).css('width'),})
				}
			}
		});
	});

    function getGrade() {
        // The following return value may or may not be used to grade
        // server-side.
        // If getState and setState are used, then the Python grader also gets
        // access to the return value of getState and can choose it instead to
        // grade.
        return JSON.stringify(state['complete']);
    }

    function getState() {
        return JSON.stringify(state);
    }

    // This function will be called with 1 argument when JSChannel is not used,
    // 2 otherwise. In the latter case, the first argument is a transaction
    // object that will not be used here
    // (see http://mozilla.github.io/jschannel/docs/)
    function setState() {
        //so this returns nothing, it just changes some things. let's make it do nothing.
        var nope = false;
    }

    return {
        getState: getState,
        setState: setState,
        getGrade: getGrade
    };
}());