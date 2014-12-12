var officer = (function() {

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

    var imageList = [["heine", "https://files.edx.org/vjx/bsD1/r01_176L_Heine.jpg"], ["heine","https://files.edx.org/vjx/bsD1/r01_281L_Heine.jpg"], ["brown","https://files.edx.org/vjx/bsD1/r01_194La_Brown.jpg"], ["adams","https://files.edx.org/vjx/bsD1/r40_006_Adams.png"], ["adams","https://files.edx.org/vjx/bsD1/r02_136_Adams.jpg"], ["oliver","https://files.edx.org/vjx/bsD1/r40_006_Oliver.png"], ["oliver","https://files.edx.org/vjx/bsD1/r30_039i_Oliver.png"], ["oliver","https://files.edx.org/vjx/bsD1/r30_037i_Perry_Son.jpg"], ["abbott","https://files.edx.org/vjx/bsD1/r40_006_Abbot.png"], ["portman","https://files.edx.org/vjx/bsD1/r40_006_Portman.png"], ["williams","https://files.edx.org/vjx/bsD1/r40_006_Williams.png"], ["morrow","https://files.edx.org/vjx/bsD1/r51_022_Morrow.jpg"]];
    var previous = [];
    var score = 0
    function classToPerson(correctClass){
        switch(correctClass){
            case "abbott":
                return("Captain Joel Abbott");
                break;
            case "portman":
                return("Interpreter Anton Portman");
                break;
            case "morrow":
                return("Botanist Dr. James Morrow");
                break;
            case "williams":
                return("Interpreter S. Wells Williams");
                break;
            case "oliver":
                return("Oliver Perry, Commodore Perry's son");
                break;
            case "heine":
                return("Artist William Heine");
                break;
            case "adams":
                return("Commander Henry Adams");
                break;
            default:
                return("Photographer Eliphalet Brown");
        }
    }

    $(document).ready(function(){
        $("#newGame").on('click', function(){
            console.log(score);
            var points = true;
            $('#gameScreen').empty(); //clear game screen
            $('#findIt').empty(); //clear person to be found.
            $('#hints').empty();
            //pick a random image to be correct, don't pick it if it's been done this cycle, reset cycle if there are 12 items in previous.
            if(previous.length === 12){
                $('#newGame').empty();
                $('#newGame').append("Play Again"); //once game is started, make it next instead of new game
                previous = [];
                var results = "<p>You scored a " + score + " out of a possible 12."
                var need = 9;
                if(score >= need){
                    results += "</p> Great Job! Hit 'check' below to recive points for this problem.";
                }
                else{
                    results += " To recieve points for this problem, you need a score of at least " + need + ".</p>";
                }
                score = 0;
                $('#gameScreen').append(results);
            }
            else{
                $('#newGame').empty();
                $('#newGame').append("Next"); //once game is started, make it next instead of new game
                do{
                    var correct = Math.floor(Math.random()*12); //number between 0 and 16
                }while(previous.indexOf(correct) > -1);
                //at this point previous should be under 12
                previous.push(correct); //Previous is a list of integers!!!
                //now we have a number for the correct one. The url is at imageList[correct]
                //need to include correct and seven others. How to choose them?
                //what is the correct class?
                var correctClass = imageList[correct][0]; //gets class of correct answer
                imagesUsed = ["class='" + correctClass + "'><img src='" + imageList[correct][1] + "'/>"]; //NOW it's a list of URLs with little strings
                do{
                    var temp = [];
                    for(i=0;i<imageList.length;i++){ //iterate over imageList
                        var toAdd = "class='" + imageList[i][0] + "'><img src='" + imageList[i][1] + "'/>";
                        if(imagesUsed.indexOf(toAdd) === -1 && imageList[i][0] !== correctClass){ //if it's not already in temp and not of the same class
                            temp.push(toAdd); //add it to temp
                        }
                    }
                    //now we have a temp list full of things we haven't used yet
                    var choose = Math.floor(Math.random()*temp.length); //get a random value in length of temp
                    imagesUsed.push(temp[choose]); //a random value in temp
                }while(imagesUsed.length < 8); //add images while imagesUsed is under 8 things.
                //now we have a full image list. Shuffle it.
                for(var j, x, i = imagesUsed.length; i; j = parseInt(Math.random() * i), x = imagesUsed[--i], imagesUsed[i] = imagesUsed[j], imagesUsed[j] = x);
                //have shuffled imagesUsed, they have proper classes and such hopefully
                //Who are we checking?
                var person = classToPerson(correctClass);
                //got person, got image list. Create page now? New game button always at bottom. Everything in main will be text centered.
                var doIt = "<p>Find the image of " + person + ".</p>";
                //add all the images to data with proper class ids? They've got correct and wrong and href's already.
                var data = "";
                for(i = 0; i < imagesUsed.length; i++){
                    var image = "<div " + imagesUsed[i] + "</div>";
                    data += image;
                }
                $("#gameScreen").append(data);
                $("#findIt").append(doIt);
                //data is up, now click go aways.
                //possible classes are abbott, portman, morrow, williams, oliver, heine, adams, and brown
                var possibleClass = [".abbott", ".portman", ".morrow", ".williams", ".oliver", ".heine", ".adams", ".brown"];
                $(".abbott, .portman, .morrow, .williams, .oliver, .heine, .adams, .brown").on('click',function(){
                    var thisClass = $(this).attr('class');
                    if(thisClass !== "used"){ //check if the thing we clicked was actually a think we have a function for
                        if(thisClass === correctClass){
                            $("#gameScreen").children().removeClass();
                            $("#gameScreen").children().addClass("used");
                            $("#gameScreen").children().not(this).children().fadeOut(400);
                            $("#hints").empty();
                            if(points){
                                score += 1
                                state.points += 1;
                                $("#hints").append("<p style='color:green'>First Try! +1 point</p>").fadeIn(1000);
                            }
                            else{
                                $("#hints").append("<p style='color:green'>Correct!</p>").fadeIn(1000);                                 
                            }
                        }
                        else{
                            points = false;
                            $(this).removeClass();
                            $(this).addClass("used");
                            $(this).children().fadeOut(400,function(){
                                $("#hints").empty();
                                $("#hints").append("<p style='color:red'>Sorry, that is " + classToPerson(thisClass) + ".</p>").fadeIn(1000);
                            });
                        }
                    }
                });
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