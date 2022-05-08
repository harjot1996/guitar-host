let score = 0;
const chords = ["C", "G", "Am", "F"];

function updateScore() {
    for (let key in correct) {
        score += correct[key]
    }

    $('#score-value').text("Your score: " + score + " / " + max)
}

function updateError() {
    let text = $('#score-info')
    let line = $('<div></div>')
    line.addClass('score-heading')
    line.text("Your correct answers:")
    text.append(line)
    for (let key in correct) {
        let line = $('<div></div>')
        line.addClass('score-entry')
        let total = wrong[key] + correct[key]
        let correct_chord = correct[key]
        line.text('Chord ' + chords[key] + '  :  ' + correct_chord + ' / ' + total)
        if (total> 0) {
            text.append(line)
        }
    }
}

$( document ).ready(function() {
    $('#nav-quiz').addClass('active')

    $('#return').click(function () {
        window.location.href = '/start-quiz';
    });

    updateScore();

    updateError();
});