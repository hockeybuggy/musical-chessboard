
var $board = $("#board");
var $settings = $("#sidebar_form");

var fileMap = {
    0 : "a",
    1 : "b",
    2 : "c",
    3 : "d",
    4 : "e",
    5 : "f",
    6 : "g",
    7 : "h"
};


init_board();
init_sound();
bind_squares();

$settings.on( "change", function(){
    console.log(event);
    if (event.target.tagName === "SELECT") {
        console.log("SELECT!!!");
    }
});

function bind_squares(){
    $board.on("click", handle_square_click);
}

function handle_square_click() {
    console.log(event.target.id);
    $square = $(event.target);
    highlight_square($square);
    play_square($square);
}

function highlight_square($square){
    //console.log($square);
    $square.addClass("highlight");
    //$square.css("background-color", "#FF6600"); //TODO fix just adding the class
    //console.log($square);
    window.setTimeout(function(){
        $square.removeClass("highlight");
        //$square.css("background-color", "#ffffff");
    }, 500);
}

function play_square($square){
    console.log($square);
    var delay = 0; // play one note every quarter second
    var note = get_note($square.context.id); // the MIDI note
    var velocity = 127; // how hard the note hits

    MIDI.setVolume(0, 127);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);
}

function get_note(squareId){
    console.log(squareId);
    fileMap = {
        "a": 45,
        "b": 46, // Bb
        "c": 48,
        "d": 50,
        "e": 52,
        "f": 53,
        "g": 56,
        "h": 47, // B
    }
    file = squareId[0];
    //rank = squareId[1];
    return(fileMap[file]);
}


function init_board(){
    // This is what I used to generate the board in the first place.
    // This could be useful if this signifcanlty reduces file size and does not
    // impact load time too much
    var i, j;
    var row = "";
    for(i = 1; i <= 8; i += 1){
        row = "<tr>";
        for(j = 0; j < 8; j += 1){
            squareId = fileMap[j] + i;
            row += "<td class='square' id='" + squareId + "'>"+ squareId +"</td>";
        }
        row += "</tr>";
        $board.append(row);
    }
    //console.log($board.html());
}
function init_sound() {
window.onload = function () {
    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        callback: function() {
            var delay = 0; // play one note every quarter second
            var note = 50; // the MIDI note
            var velocity = 127; // how hard the note hits
            // play the note
            // TODO add a loading screen
            MIDI.setVolume(0, 127);
            MIDI.noteOn(0, note, velocity, delay);
            MIDI.noteOff(0, note, delay + 0.75);
        }
    });
};
}

