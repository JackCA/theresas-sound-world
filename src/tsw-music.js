/*********************************
 * Theresas's Sound World - Music
 * tsw-music.js
 * Dependencies: tsw-core.js
 * Copyright 2013 Stuart Memo
 ********************************/

(function (window, undefined) {
    'use strict';

    var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
        natural_notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    // append list of notes to itself to avoid worrying about writing wraparound code

    notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    notes.push.apply(notes, notes);

    var intervals = ['unison', 'flat 2nd', '2nd', 'minor 3rd', 'major 3rd', 'perfect 4th',
                    'flat 5th', 'perfect 5th', 'minor 6th', 'major 6th', 'minor 7th',
                    'major 7th', 'octave', 'flat 9th', '9th', 'sharp 9th', 'major 10th',
                    '11th', 'augmented 11th', 'perfect 12th', 'flat 13th', '13th'];

    /*
     * Get position of note in note array.
     *
     * @method getNotePosition
     * @param {string} note Note to get position of.
     * @return {number} Position of note in note array.
     */
    var getNotePosition = function (note) {
        var notesLength = notes.length,
            position_on_scale;

        // don't use forEach as we're breaking early
        for (var i = 0; i < notesLength; i++) {
            if (note.toUpperCase() === notes[i]) {
                position_on_scale = i;
                return i;
            }
        }

        return null;
    };

    /*
     * Returns major scale of given root note
     * 
     * @method getMajorScale
     * @param {string} rootNote Root note of the scale
     * @return {array} List of notes in scale
     */
    var getMajorScale = function (rootNote) {
        var scale = [],
            positionOnScale = getNotePosition(rootNote);
        
        scale.push(notes[positionOnScale]);
        scale.push(notes[positionOnScale + 2]);
        scale.push(notes[positionOnScale + 4]);
        scale.push(notes[positionOnScale + 5]);
        scale.push(notes[positionOnScale + 7]);
        scale.push(notes[positionOnScale + 9]);
        scale.push(notes[positionOnScale + 11]);
        scale.push(notes[positionOnScale + 12]);

        return scale;
    };

    /*
     * Returns minor scale of given root note
     * 
     * @method getMinorScale
     * @param {string} rootNote Root note of the scale
     * @return {array} List of notes in scale
     */
    var getMinorScale = function (rootNote) {
        var scale = [],
            positionOnScale = getNotePosition(rootNote);
        
        scale.push(notes[positionOnScale]);
        scale.push(notes[positionOnScale + 2]);
        scale.push(notes[positionOnScale + 3]);
        scale.push(notes[positionOnScale + 5]);
        scale.push(notes[positionOnScale + 7]);
        scale.push(notes[positionOnScale + 8]);
        scale.push(notes[positionOnScale + 10]);
        scale.push(notes[positionOnScale + 12]);

        return scale;
    };

    /*
     * Decides whether a string looks like a valid note.
     *
     * @method isValidNote
     * @param {string} Name of note to test.
     * return {boolean} If note is valid.
     */
    var isValidNote = function (note) {
        if ((typeof note !== 'string') || (note.length > 3)) {
            return false;
        }
        return true;
    }

    /*
     * Parses a chord name into a detailed object.
     *
     * @method parseChord 
     * @param {string} chord Name of chord to turn into object.
     * return {object} Detailed chord object.
     */
    tsw.parseChord = function (chord) {
        var chordObj = {},
            notePositions = [],
            rootNotePosition = 0;

        if (Array.isArray(chord)) {
            return false;
        }

        chord = chord.toLowerCase();

        chordObj.rootNote = chord[0].toUpperCase();
        chordObj.isMajor = (chord.indexOf('maj') > -1);
        chordObj.isMinor = !chordObj.isMajor && (chord.indexOf('m') > -1);
        chordObj.is7th = (chord.indexOf('7') > -1);
        chordObj.notes = [];

        if (!chordObj.is7th) {
            chordObj.octave = chord.match(/\d/g);
        }

        if (!chordObj.isMajor && !chordObj.isMinor) {
            // Hey! This aint no chord that I've ever seen!
            return false;
        }

        rootNotePosition = getNotePosition(chordObj.rootNote);
        notePositions.push(rootNotePosition);

        if (chord.isMinor) {
            notePositions.push(rootNotePosition + tsw.getSemitoneDifference('minor 3rd'));
        } else {
            notePositions.push(rootNotePosition + tsw.getSemitoneDifference('major 3rd'));
        }

        notePositions.push(rootNotePosition + tsw.getSemitoneDifference('perfect 5th'));
        notePositions.push(rootNotePosition + tsw.getSemitoneDifference('octave'));

        notePositions.forEach(function (position) {
            chordObj.notes.push(notes[position]);
        });

        return chordObj.notes;
    };

    /*
     * Returns a list of notes in a given scale.
     * 
     * @method getScale
     * @param {string} rootNote Root note to base scale on.
     * @param {string} scaleType Type of scale to return.
     * @return {array} List of notes in scale.
     */
    tsw.getScale = function (rootNote, scaleType) {
        if (scaleType === 'minor') {
            return getMinorScale(rootNote);
        } else {
            return getMajorScale(rootNote);
        }
    };

    /*
     * Returns the number of semitones an interval is from a base note.
     *
     * @method getSemitoneDifference
     * @param {string} interval The name of the interval
     * @return {number} Number of semitones of interval from a base note.
     */
    tsw.getSemitoneDifference = function (interval) {
        var numberOfIntervals = intervals.length;

        for (var i = 0; i < numberOfIntervals; i++) {
            if (interval === intervals[i]) {
                return i;
            }
        }
    };

    tsw.getChord = function (str) {
        return this.parseChord(str);
    };

    /*
     * Returns a list of notes in a given chord.
     *
     * @method chordToNotes
     * @param {string} chord Name of chord to turn into string.
     * @return {array} List of notes in chord.
     */
    tsw.chordToNotes = function (chord) {
        chord = this.parseChord(chord);

        return chord.notes;
    };

    /*
     * Returns the flat equivalent of a given note.
     *
     * @method sharpToFlat
     * @param {string} note Note to convert.
     * @return {string} New flat note.
     */
    tsw.sharpToFlat = function (note) {
        var new_note;

        note = note.replace('#', 'b');
        new_note = String.fromCharCode(note[0].toUpperCase().charCodeAt(0) + 1);

        if (new_note === 'H') {
            new_note = 'A';
        }

        new_note += note.substr(1);

        return new_note;
    };

    /*
     * Returns the sharp equivalent of a given note.
     *
     * @method flatToSharp
     * @param {string} note Note to convert.
     * @return {string} New sharp note.
     */
    tsw.flatToSharp = function (note) {
        var new_note,
            num_index = 0;

        // Note isn't flat to begin with
        if (note.indexOf('b') === -1) {
            return note;
        }

        note = note.replace('b', '#');

        // Get previous letter in alphabet.
        new_note = String.fromCharCode(note[0].toUpperCase().charCodeAt(0) - 1);

        if (new_note === '@') {
            new_note = 'G';
        }

        // If new note is B, decrease the octave by 1.
        if (new_note === 'B') {
            num_index = note.search(/\d/);
            if (num_index > -1) {
                note = note.substring(0, num_index) + (note[num_index] - 1) + note.substring(num_index + 1);
            } 
        }

        new_note += note.substr(1);

        return new_note;
    };

    /*
     * Calculates the frequency of a given note.
     *
     * @method getFrequency
     * @param {string} note Note to convert to frequency
     * @return {number} Frequency of note
     */
    tsw.getFrequency = function (note) {
        var octave,
            keyNumber,
            note_index,
            note_without_octave;

        if (isValidNote(note) === false) {
            return false;
        }

        note_index = note.search(/\d/),
        octave = parseInt(note.slice(-1));

        if (isNaN(octave)) {
            octave = 4;
        } 

        note = this.flatToSharp(note);
        note_without_octave = note;

        /*
        switch (note.length) {
            case 1:
                noteLetter = note[0];
                break;
            case 2:
                if (note.indexOf('#')) {
                    noteLetter = note;
                } else {
                    noteLetter = note[0];
                }
                break;
            case 3:
                noteLetter = note.slice(0, 2);
                break;
            default:
                return 'This doesn\'t look like any note I\'ve seen';
        }
        */

        if (note_index > -1) {
            note_without_octave = note.substr(0, note_index);
        }

        keyNumber = notes.indexOf(note_without_octave.toUpperCase());
        keyNumber = keyNumber + (octave * 12);

        // Return frequency of note
        return parseFloat((440 * Math.pow(2, (keyNumber - 57) / 12)), 10);
    };

 })(window);
