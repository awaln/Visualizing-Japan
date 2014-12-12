var D1Sort = (function() {

    var state = {
            'points': 0
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

    $(document).ready(function(){
        var data = ['https://files.edx.org/vjx/sh01/sh01_1925_e007_poster.jpg','https://files.edx.org/vjx/shGR/sh02_GR_1933_10_0511.jpg','https://files.edx.org/vjx/shCS/sh02_CS_1935_10_1.jpg','https://files.edx.org/vjx/shGP/sh02_GP_1926_04_1901.jpg','https://files.edx.org/vjx/bss/01_359L_narr_Samurai.jpg','https://files.edx.org/vjx/bss/30_013c_ShipAndCrew.jpg','https://files.edx.org/vjx/bss/30_046i_Adams_Perry.jpg','https://files.edx.org/vjx/bss/40_014_minstrel.jpg','https://files.edx.org/vjx/trg/trg004_pg4_18Sept1905.jpg','https://files.edx.org/vjx/trg/trg030_pg30_18Sept1905.jpg','https://files.edx.org/vjx/wtg/trg205_10July1904_no15.jpg','https://files.edx.org/vjx/wtg/trg221_10Aug1905_no61.jpg'];
        for(i=0;i<data.length;i++){ //function to add proper urls to everything
            if(Math.floor(Math.random()*2)===0){ //flips a coin and randomly places divs on page.
                $("#vjxContent").append("<div class='vjxContainer'><img src='" + data[i].slice(0,-4) + "_200.jpg'/></div>");
            }
            else{
                $("#vjxContent").prepend("<div class='vjxContainer'><img src='" + data[i].slice(0,-4) + "_200.jpg'/></div>");
            }
        }
        $('.vjxContainer').draggable({ //this is to shrink the image when you drag it (so it fits in the #topbin) and re-embiggen it when you put it down
            containment:'document',
            revert:true,
            start:function(event,ui){
                $(this).css('z-index','50');
            },
            stop:function(event,ui){
                $(this).css('z-index','');
            }
        });
        $('#bss, #hibiya, #shiseido').droppable({
            drop:function(event,ui){
                if(($(ui.draggable).children('img').attr('src').slice(26,27)==="s") && ($(this).attr('id')==="shiseido")){ //if it's a shiseido image in right place.
                    $(this).append("<img src='" + $(ui.draggable).children('img').attr('src') + "'/>");
                    $(ui.draggable).remove();
                }
                else if(($(ui.draggable).children('img').attr('src').slice(26,27)==="b") && ($(this).attr('id')==="bss")){ //if it's a bss image in right place.
                    $(this).append("<img src='" + $(ui.draggable).children('img').attr('src') + "'/>");
                    $(ui.draggable).remove();
                }
                else if(($(ui.draggable).children('img').attr('src').slice(26,27)==="t") && ($(this).attr('id')==="hibiya")){ //if it's a hibiya image in right place.
                    $(this).append("<img src='" + $(ui.draggable).children('img').attr('src') + "'/>");
                    $(ui.draggable).remove();
                }
                else if(($(ui.draggable).children('img').attr('src').slice(26,27)==="w") && ($(this).attr('id')==="hibiya")){ //if it's a hibiya image in right place.
                    $(this).append("<img src='" + $(ui.draggable).children('img').attr('src') + "'/>");
                    $(ui.draggable).remove();
                }
                if($('.vjxContainer').length === 0){
                    state.points = 1;
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
        return JSON.stringify(state['points']);
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