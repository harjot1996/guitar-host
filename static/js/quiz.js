const button_ids = ['option-0', 'option-1', 'option-2', 'option-3'];

function submitFingerQuiz(fingerResult) {
    response = fingerResult;
    postResponse(JSON.stringify(fingerResult), fingerFormatResponseHandler);
}

function fingerFormatResponseHandler() {
    if (typeof response === "string") {
        response = JSON.parse(response)
    }
    displayFingers();
    if (correctFingers()) {
        handleCorrectMcq();
    } else {
        handleIncorrectMcq("Incorrect!");
    }
    nextOrFinish();
}

function correctFingers() {
    let fingerMap = response;
    let responseKeys = Object.keys(fingerMap);
    let actualFingerMap = data['fingers'];
    console.log(responseKeys)
    console.log(actualFingerMap)
    console.log(fingerMap)
    for (let i = 0; i < responseKeys.length; i++) {
        let responseKey = responseKeys[i];
        if (!actualFingerMap.hasOwnProperty(responseKey) || (fingerMap[responseKey]).toString() !== actualFingerMap[responseKey]) {
            console.log((fingerMap[responseKey]).toString())
            console.log((actualFingerMap[responseKey]))
            return false;
        }
    }
    return true;
}

function displayFingers() {
    let fingerMap = response;
    let mapKeys = Object.keys(fingerMap);
    for (let i = 0; i < mapKeys.length; i++) {
        centerFinger(mapKeys[i], 'finger-' + fingerMap[mapKeys[i]])
    }
    $('#reset-fingers').attr('hidden', 'true');
    $('#submit-fingers').attr('hidden', 'true');
}

function responseHandler() {
    $("#option-"+response).removeClass("btn-secondary");
    $("#option-"+response).addClass("btn-primary");
    $("#check").attr("hidden", "true");
    button_ids.forEach(function (id, _) {
        $("#"+id).prop("disabled",true);
    });
    if (parseInt(data['id']) === parseInt(response)) {
        handleCorrectMcq()
    } else {
        handleIncorrectMcq("Correct answer: " + data['chord'])
    }
    nextOrFinish()
}

function nextOrFinish() {
    if (parseInt(seq) < total) {
        $('#next').removeAttr('hidden');
    } else {
        $('#finish').removeAttr('hidden');
    }
}

function handleCorrectMcq() {
    //$("#option-" + response).css("background-color","green");
    $(".bottom-quiz").addClass("bottom-green");
    $("#result-placeholder").html("Correct!");
    $("#result-placeholder").addClass("result-correct");
}

function handleIncorrectMcq(placeholder) {
    //$('#incorrect').removeAttr('hidden');
    $(".bottom-quiz").addClass("bottom-red");
    $('#review').removeAttr('hidden');
    //$("#option-" + response).css("background-color","red");
    //$("#option-" + data['id']).css("background-color","green");
    $('#next').addClass('button-override-red');
    $("#result-placeholder").html(placeholder);
    $("#result-placeholder").addClass("result-incorrect");
}

function postResponse(response, handler) {
    let payload = {"response": response.toString()}
    ajax_('/log-quiz-response/' + seq.toString(), payload, handler);
}

function validate(index) {
    response = index;
    button_ids.forEach(function (id, _) {
        $("#"+id).removeClass("btn-primary");
        $("#"+id).addClass("btn-secondary");
    });
    $("#option-"+response).removeClass("btn-secondary");
    $("#option-"+response).addClass("btn-primary");

    $('#check').click(function() {
        postResponse(response, responseHandler());
    });
    $("#check").removeClass("disabled-button");
}

function updateProgressbar() {
    console.log(total);
    $('#progress-group').attr('aria-valuemax', total);
    $('#progress-group').attr('aria-valuenow', parseInt(seq));
    let progress = ((parseInt(seq) -1) / total) * 100 + '%'
    $('#progress-group').css('width', progress);
    //$('#progress-group').html((parseInt(seq) -1) + ' / ' + total );
    //$('#progress-text').text(parseInt(seq) + '/' + total)

    let $progress = $('#progress_');
    let offset = $progress.offset();
    let width = $progress.width();
    let height = $progress.height();

    let centerX = offset.left + width / 2;
    let centerY = offset.top + height / 2;

    $('#progress-count').html((parseInt(seq) -1) + ' / ' + total );
    let $count = document.getElementById('progress-count');
    $count.style.position = "absolute";
    $count.style.left = (centerX  - ($count.offsetWidth / 2)) + 'px';
    $count.style.top = (centerY  - ($count.offsetHeight / 2)) + 'px';
}

function playChord() {
    let audio = document.getElementById("audio");
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

$( document ).ready(function() {
    if (response !== -1) {
        if (format !== 0) {
            responseHandler();
        }
    }

    $('#nav-quiz').addClass('active')

    updateProgressbar();

    $('#play-button').click(function() {
        playChord();
    });

    $('#option-0').click(function() {
        validate(0)
    });

    $('#option-1').click(function() {
        validate(1)
    });

    $('#option-2').click(function() {
        validate(2)
    });

    $('#option-3').click(function() {
        validate(3)
    });

    $('#next').click(function() {
        window.location.href = '/quiz/' + (parseInt(seq) + 1);
    });

    $('#finish').click(function() {
        window.location.href = '/score';
    });

    $('#review').click(function() {
        let chapter = data['symbol'].toLowerCase();
        window.location.href = '/learn/review/' + chapter;
    })
});
