const numberOfFrets = 4;
const numberOfStrings = 6;
const numberOfFingers = 3;
let fingerResult = {};

function setupFretboard() {
    let root = document.documentElement;
    let fretboard = document.querySelector('.fretboard');

    fretboard.innerHTML = '';
    root.style.setProperty('--number-of-strings', numberOfStrings.toString());
    for (let i = 0; i < numberOfStrings; i++) {
        let string = createElement('div');
        string.classList.add('string');
        fretboard.appendChild(string);

        for (let fret = 0; fret <= numberOfFrets; fret++) {
            let noteFret = createElement('div');
            let fretClass = 'note-fret';
            if (i === numberOfStrings - 1) fretClass = 'note-fret-right';
            if (fret === numberOfFrets) fretClass = 'note-fret-bottom';
            if (fret === numberOfFrets && i === numberOfStrings - 1) fretClass = 'note-fret-last';

            let id = (6-i) + "-" + (fret+1);
            noteFret.setAttribute('id', id);
            noteFret.classList.add(fretClass);
            string.appendChild(noteFret);

            $("#" + id).droppable({
                accept: ".draggable-finger",
                classes: {
                    "ui-droppable-active": "dark",
                    "ui-droppable-hover": "darker"
                },
                drop: function (event, ui) {
                    let fret = event['target']['id']
                    let finger = event['originalEvent']['target']['id'];
                    centerFinger(fret, finger);
                },
                tolerance: "touch",
            });
        }
    }
}

function centerFinger(fret, finger) {
    let $fret = $('#' + fret);
    let offset = $fret.offset();
    let width = $fret.width();
    let height = $fret.height();

    let centerX = offset.left + width / 2;
    let centerY = offset.top + height / 2;

    let $finger = document.getElementById(finger);
    $finger.style.position = "absolute";
    $finger.style.left = (centerX  - ($finger.offsetWidth / 2)) + 'px';
    $finger.style.top = (centerY  - ($finger.offsetHeight / 2)) + 'px';

    removePrevious(finger.substring(7));
    fingerResult[fret] = finger.substring(7);


    if (Object.keys(fingerResult).length === numberOfFingers) {
        $("#submit-fingers").removeClass("disabled-button");
    }
}

function removePrevious(fret) {
    for (let i=0; i<Object.keys(fingerResult).length; i++) {
        if (fingerResult[Object.keys(fingerResult)[i]] === fret) {
            delete fingerResult[Object.keys(fingerResult)[i]];
        }
    }
}

function setupFingerPane() {
    fingerResult = {};
    $('#submit-fingers').addClass("disabled-button");
    let fingerPane = document.querySelector('.finger-pane');
    fingerPane.innerHTML = '';

    for (let i = 0; i < numberOfFingers; i++) {
        let fingerHolder = createElement('div');
        fingerHolder.classList.add('finger-holder');

        let draggableFinger = createElement('div');
        draggableFinger.classList.add('draggable-finger');
        draggableFinger.setAttribute('id', 'finger-' + (i+1));
        draggableFinger.innerHTML = i+1;
        draggableFinger.style.position = "relative";

        fingerHolder.appendChild(draggableFinger);
        fingerPane.appendChild(fingerHolder);
    }

    $(".draggable-finger").draggable({
        zIndex: 10000,
        revert: "invalid",
    });
}

$( document ).ready(function() {
    $('#reset-fingers').click(function() {
        setupFingerPane();
    });

    $('#submit-fingers').click(function() {
        if (Object.keys(fingerResult).length === numberOfFingers) {
            submitFingerQuiz(fingerResult);
        }
    });

    setupFretboard();
    setupFingerPane();

    if (response !== -1) {
        fingerFormatResponseHandler();
    }
});

setupFretboard();
setupFingerPane();