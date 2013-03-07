
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

var currentNoteMap;
var currentOctaveMap;

var germanNoteMap = {
    "a" : "A",
    "b" : "Bb",
    "c" : "C",
    "d" : "D",
    "e" : "E",
    "f" : "F",
    "g" : "G",
    "h" : "B" 
};

var scaleNoteMap = {
    "a" : "C",
    "b" : "D",
    "c" : "E",
    "d" : "F",
    "e" : "G",
    "f" : "A",
    "g" : "B",
    "h" : "C" 
};

var jazzNoteMap = {
    "a" : "C",
    "b" : "D",
    "c" : "E",
    "d" : "F",
    "e" : "G",
    "f" : "A",
    "g" : "Bb",
    "h" : "B" 
};

var flatOctaveMap = {
    "1" : 4,
    "2" : 4,
    "3" : 4,
    "4" : 4,
    "5" : 4,
    "6" : 4,
    "7" : 4,
    "8" : 4 
};

var vallyOctaveMap = {
    "1" : 4,
    "2" : 4,
    "3" : 4,
    "4" : 4,
    "5" : 4,
    "6" : 4,
    "7" : 4,
    "8" : 4 
};

var mountainOctaveMap = {
    "1" : 4,
    "2" : 4,
    "3" : 4,
    "4" : 4,
    "5" : 4,
    "6" : 4,
    "7" : 4,
    "8" : 4 
};

var noteToMidiMap = {
    "C":0,
    "C#":1,
    "D":2,
    "D#":3,
    "E":4,
    "F":5,
    "F#":6,
    "G":7,
    "G#":8,
    "A":9,
    "Bb":10,
    "B":11
};

init_board();
init_sound();
bind_squares();

$settings.on( "change", update_settings);


function update_settings() {
    console.log(event);
    if (event.target.tagName === "SELECT") {
        update_sound_mapping();
    }

    else if (event.target.name === "notePreset") {
        if (event.target.id === "german") {
            set_preset(germanNoteMap);
        }
        else if (event.target.id === "jazz") {
            set_preset(jazzNoteMap);
        }
        else if (event.target.id === "scale") {
            set_preset(scaleNoteMap);
        }
    }

    else if (event.target.name === "octavePreset") {
        if (event.target.id === "flat") {
            set_octave_mapping(flatOctaveMap);
        }
        else if (event.target.id === "vally") {
            set_octave_mapping(vallyOctaveMap);
        }
        else if (event.target.id === "mountain") {
            set_octave_mapping(mountainOctaveMap);
        }
    }
}

function set_preset(noteMap){ 
    console.log(noteMap);
    var i = 0;
    for(var mapping in noteMap){
        //console.log(noteMap[mapping]);
        set_option("file_" + fileMap[i++], noteMap[mapping]);
    }
    update_sound_mapping();
}

function set_octave_mapping(octaveMap){
    console.log(octaveMap);
    var i = 0;
    for(var mapping in octaveMap){
        //console.log(noteMap[mapping]);
        set_option("rank_" + i++ , octaveMap[mapping]);
    }
    update_sound_mapping();
}

function set_option(selectId, optionId) {
    //selectId  the id of the select you wish to change the selected option of
    //optionId  the id of the new option you wish selected
    //eg  set_option("file_a", "C");   , sets the select for the file a to C
    var i;
    selectEle = document.getElementById(selectId);
    //console.log(selectEle);
    for(i = 0; i < selectEle.options.length; i += 1) {
        if(selectEle.options[i].value == optionId){
            selectEle.selectedIndex = i;
        }
    }
}

function update_sound_mapping(){
    var i;
    var new_fileToNoteMap = {};
    //console.log(fileMap.size);
    for (var k in fileMap) {
        newNote = $("#file_" + fileMap[k]).find(":selected").text(); // TODO here
        new_fileToNoteMap[fileMap[k]] = newNote;
    }
    for (var k in rankMap) {
        newNote = $("#rank_" + k).find(":selected").text(); // TODO here
        console.log(newNote);
        console.log(k);
        new_rankToOctaveMap[k] = newOctave;
    }
    //console.log(new_fileToNoteMap);
    currentOctaveMap = new_rankToOctaveMap;
    currentNoteMap = new_fileToNoteMap;
}

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
    //console.log($square);
    var delay = 0; // play one note every quarter second
    var note = get_note($square.context.id); // the MIDI note
    var velocity = 127; // how hard the note hits

    // TODO consider a loading thing...
    MIDI.setVolume(0, 127);
    MIDI.noteOn(0, note, velocity, delay);
    MIDI.noteOff(0, note, delay + 0.75);
}

function get_note(squareId){
    file = squareId[0];
    rank = squareId[1];
    console.log(rank);
    noteStr = currentNoteMap[file];
    octave = currentOctaveMap[rank]
    console.log(noteStr);
    noteNum = get_note_number(noteStr,octave);
    return(noteNum);
}

function get_note_number(noteStr, octave) {
    return(noteToMidiMap[noteStr] + octave * 12); 
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
}
function init_sound() {
    currentNoteMap = germanNoteMap; // Set default mappings
    currentOctaveMap = flatOctaveMap;

    window.onload = function () {
    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano", // TODO allow for guitar as well
        callback: function() {
            // TODO add a loading screen
            var delay = 0; // play one note every quarter second
            var note = 50; // the MIDI note
            var velocity = 127; // how hard the note hits
            // play the note
            MIDI.setVolume(0, 127);
            MIDI.noteOn(0, note, velocity, delay);
            MIDI.noteOff(0, note, delay + 0.75);
        }
    });
};
}

