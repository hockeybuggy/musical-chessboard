//This file contains the main logic for the music app.

var $board = $("#board");
var $settings = $("#sidebar_form");
var currentNoteMap;
var currentOctaveMap;

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
        setNoteMap(get_manual_noteMap());
    }

    else if (event.target.name === "notePreset") {
        if (event.target.id === "german") {
            set_manual_selects_to_preset(germanNoteMap);
            set_note_mapping(germanNoteMap);
        }
        else if (event.target.id === "jazz") {
            set_manual_selects_to_preset(jazzNoteMap);
            set_note_mapping(jazzNoteMap);
        }
        else if (event.target.id === "scale") {
            set_manual_selects_to_preset(scaleNoteMap);
            set_note_mapping(scaleNoteMap);
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

function set_manual_selects_to_preset(noteMap){ 
    console.log(noteMap);
    var i = 0;
    for(var mapping in noteMap){
        //console.log(noteMap[mapping]);
        set_option("file_" + fileMap[i++], noteMap[mapping]);
    }
}

function set_note_mapping(noteMap){
    console.log(noteMap);
    currentNoteMap = noteMap;
    //get_manual_noteMap();
}
function set_octave_mapping(octaveMap){
    console.log(octaveMap);
    currentOctaveMap = octaveMap;
    //get_manual_noteMap();
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

function get_manual_noteMap(){
    var new_fileToNoteMap = {};
    //console.log(fileMap.size);
    for (var k in fileMap) {
        newNote = $("#file_" + fileMap[k]).find(":selected").text(); // TODO here
        new_fileToNoteMap[fileMap[k]] = newNote;
    }
    //console.log(new_fileToNoteMap);
    //currentOctaveMap = new_rankToOctaveMap;
    return(new_fileToNoteMap)
    //update_sound_mapping(new_fileToNoteMap, new_rankToOctaveMap);
}

function bind_squares(){
    $board.on("click", handle_square_click);
}

function handle_square_click(event) {
    console.log(event.target.id);
    $square = $(event.target);
    highlight_square($square);
    play_square($square);
}

function highlight_square($square){
    //console.log($square);
    previous_colour = $square.context.style.backgroundColor; // NOTE  canadian spelling... WARNING
    $square.css("background-color", "#FF6600");
    window.setTimeout(function(){
        $square.css("background-color", previous_colour);
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
    //console.log(rank);
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
    // The Board's Header
    var row = "<tr><td class='file_label rank_label'></td>";
    for(i=0; i < 8; i += 1) {
        row += "<td class='file_label'>" + fileMap[i] + "</td>";
    }
    row += "</tr>";
    $board.append(row + "</tr>");
    // The Board
    for(i = 8; i > 0; i -= 1){
        row = "<tr>";
        row += "<td class='rank_label' id='rank_label_"+ i +"'>"+ i +"</td>";
        for(j = 0; j < 8; j += 1){
            squareId = fileMap[j] + i;
            row += "<td class='square' id='" + squareId + "'></td>";
        }
        row += "</tr>";
        $board.append(row);
    }
    // These are done here so that they are set after the checkering rule in the css
    $(".rank_label").css("background-color", "#aaaaaa").css("width", "20px");
    $(".file_label").css("background-color", "#aaaaaa").css("height", "20px");
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

