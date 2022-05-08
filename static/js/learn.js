const CHAPTERS = ['overview', 'c', 'g', 'am', 'f'];
let currentChapter = ""

function nextWindow(){
    return `/learn/${CHAPTERS[CHAPTERS.indexOf(currentChapter)+1]}`
}

function buttonHandler() {
    if (currentChapter === 'f') {
        $('#next').hide()
        $('#start-quiz').removeAttr('hidden');
    } else {
        $('#next').show()
        $('#start-quiz').hide()
    }
}

function getCurrentChapter(){
    const currentPath = window.location.pathname;
    currentChapter = currentPath.substring(currentPath.lastIndexOf('/') + 1);
}

function setupVideoPlayer() {
    let $videoSrc;
    $('#video-btn').click(function() {
        $videoSrc = $(this).data( "src" );
    });

    $('#myModal').on('shown.bs.modal', function(e) {
        $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" );
    })

    $('#myModal').on('hide.bs.modal', function(e) {
        $("#video").attr('src', $videoSrc);
    })
}

function playChord() {
    let audio = document.getElementById("audio");
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

$( document ).ready(function() {
    getCurrentChapter();
    setupVideoPlayer();

    $('#play-audio').click(function() {
        playChord();
    });

    $('#next').click(function() {
        window.location.href = nextWindow();
    });

    $('#start-quiz').click(function() {
        window.location.href = '/start-quiz';
    });

    $('#back-to-quiz').click(function() {
        window.history.back();
    });

    if (!review) {
        buttonHandler();
    } else {
        $('#next').attr("hidden", "true");
        $('#start-quiz').attr("hidden", "true");
        $('#back-to-quiz').removeAttr('hidden');
    }
});