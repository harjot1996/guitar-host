import json
import random
import time

from flask import Flask, request, url_for
from flask import redirect
from flask import render_template

app = Flask(__name__)

train_data = {
  "c" : {
    "audio_url": "/static/tones/c.mp3",
    "audio_alt": "Audio of C Chord",
    "video_url": "https://www.youtube.com/embed/vIzf2YryqKc",
    "video_alt": "Instruction video of C Chord",
    "fret_img_url": "/static/train/c.png",
    "fret_img_alt": "Image of C chord finger placement",
    "description": "First, position your third finger (ring finger) on the 3rd fret of the fifth string. This is a C note, and it will be the bass note of your chord. <br><br>Next, position your second (middle) finger at the second fret of the 4th string. <br><br>Finally, position your first (index) finger at the 1st fret of the second string."
  },
  "g" : {
    "audio_url": "/static/tones/g.mp3",
    "audio_alt": "Audio of G Chord",
    "video_url": "https://www.youtube.com/embed/x8UFt4uFV-E",
    "video_alt": "Instruction video of G Chord",
    "fret_img_url": "/static/train/g.png",
    "fret_img_alt": "Image of G chord finger placement",
    "description": "First, take your first finger on the second fret of the fifth string. Put your second finger on the third fret of the sixth string. <br><br>Next, put your third finger on the third fret of the first string. <br><br>Strum all six strings. "
  },
  "am" : {
    "audio_url": "/static/tones/am.mp3",
    "audio_alt": "Audio of A Minor Chord",
    "video_url": "https://www.youtube.com/embed/M9DIDxzO-gs",
    "video_alt": "Instruction video of A Minor Chord",
    "fret_img_url": "/static/train/am.png",
    "fret_img_alt": "Image of A Minor chord finger placement",
    "description": "Begin by placing your first (index) finger on the first fret of your second string.  <br><br>From there, place your second (middle) finger on the second fret of your 4th string.  <br><br>Finally, stretch your third (ring) finger over to the third string on the second fret. "
  },
  "f" : {
    "audio_url": "/static/tones/f.mp3",
    "audio_alt": "Audio of F Chord",
    "video_url": "https://www.youtube.com/embed/qY9_N9q0WQc",
    "video_alt": "Instruction video of F Chord",
    "fret_img_url": "/static/train/f.png",
    "fret_img_alt": "Image of F chord finger placement",
    "description": "There are two ways of pressing the F major chord. For the first version, your first finger hold down all strings in the first fret (as shown the picture). For the second version, your first finger lay across the 1st and 2nd on the first fret (as shown in the diagram and video). <br><br> Take your second finger, and place it on the second fret of the third string. <br><br> Place your third and forth finger on the third fret of the forth and fifth string."
  }
}
test_data = [
  {
    "id":  "0",
    "chord": "C Major",
    "symbol": "C",
    "fret_img_url": "/static/frets/c.png",
    "fret_img_alt": "Image of C chord finger placement",
    "tone_url": "/static/tones/c.mp3",
    "fingers": {"2-1": "1", "4-2": "2", "5-3": "3"}
  },
  {
    "id":  "1",
    "chord": "G Major",
    "symbol": "G",
    "fret_img_url": "/static/frets/g.png",
    "fret_img_alt": "Image of G chord finger placement",
    "tone_url": "/static/tones/g.mp3",
    "fingers": {"5-2": "1", "6-3": "2", "1-3": "3"}
  },
  {
    "id":  "2",
    "chord": "A minor",
    "symbol": "Am",
    "fret_img_url": "/static/frets/am.png",
    "fret_img_alt": "Image of Am chord finger placement",
    "tone_url": "/static/tones/am.mp3",
    "fingers": {"2-1": "1", "4-2": "2", "3-2": "3"}
  },
  {
    "id":  "3",
    "chord": "F Major",
    "symbol": "F",
    "fret_img_url": "/static/frets/f.png",
    "fret_img_alt": "Image of F chord finger placement",
    "tone_url": "/static/tones/f.mp3",
    "fingers": {"1-1": "1", "2-1": "1", "3-2": "2", "4-3": "3"}
  }
]
non_fingers = [0, 1, 2, 3]
fingers = [0, 1, 2]
chords = ["c", "g", "am", "f"]

# number of quiz questions
QUIZ_MAX = 10
# index of the question number (starting from 1 which has been answered by user)
quiz_last_answered = 0
# test data ids in the order that they have been displayed to the user in quiz
quiz_questions = []
# actual response logged by user (calculate if it was correct on incorrect based on the question data on the frontend)
quiz_responses = []
# format in the order it was displayed to the user
quiz_question_format = []

# storing timestamps for each time a learn page is opened
learn_timestamps = dict()


@app.route('/')
def landing():
    return render_template('landing.html')


@app.route('/home')
def home():
    return render_template('home.html')


def get_learn_data(chapter):
    if chapter in chords:
        return train_data[chapter]
    else:
        return {}


@app.route('/learn/<chapter>')
def learn(chapter=None):
    learn_timestamps[chapter] = time.time()
    return render_template('learn.html', chapter=chapter, data=get_learn_data(chapter), is_review=0)


@app.route('/learn/review/<chapter>')
def review(chapter=None):
    return render_template('learn.html', chapter=chapter, data=get_learn_data(chapter), is_review=1)


@app.route('/start-quiz')
def start_quiz():
    if quiz_last_answered > 0:
        return render_template('quiz-continue.html', next=quiz_last_answered + 1)
    else:
        return render_template('quiz.html')


def flush():
    global quiz_last_answered
    global quiz_questions
    global quiz_responses
    quiz_last_answered = 0
    quiz_questions = []
    quiz_responses = []


@app.route('/flush-progress', methods=['POST'])
def flush_progress():
    flush()
    return {}


def is_chord_mapping_correct(idx):
    response_map = json.loads(quiz_responses[idx])
    chord_map = test_data[int(quiz_questions[idx])]['fingers']
    for fret in response_map:
        if not (fret in chord_map and chord_map[fret] == response_map[fret]):
            return False
    return True


def is_correct(idx):
    if quiz_question_format[idx] != 0:
        return str(test_data[int(quiz_questions[idx])]['id']) == str(quiz_responses[idx])
    else:
        return is_chord_mapping_correct(idx)


@app.route('/score')
def score():
    if len(quiz_responses) < QUIZ_MAX:
        print('redirecting to quiz')
        return redirect(url_for('quiz', seq=str(len(quiz_responses) + 1)))
    else:
        correct = dict([(0,0), (1,0), (2,0), (3,0)])
        wrong = dict([(0,0), (1,0), (2,0), (3,0)])
        print(quiz_questions)
        print(quiz_responses)
        for i in range(len(quiz_questions)):
            if is_correct(i):
                correct[int(test_data[int(quiz_questions[i])]['id'])] += 1
            else:
                wrong[int(test_data[int(quiz_questions[i])]['id'])] += 1
        print(correct)
        print(wrong)
        flush()
        return render_template('score.html', correct=correct, wrong=wrong, max=QUIZ_MAX)


@app.route('/quiz/<seq>')
def quiz(seq=None):
    if int(seq) > quiz_last_answered + 1:
        return redirect(url_for('quiz', seq=str(quiz_last_answered + 1)))
    if len(quiz_questions) == quiz_last_answered and len(quiz_questions) <= QUIZ_MAX:
        quiz_question_format.append(get_next_format())
        quiz_questions.append(get_next_index())
    print(quiz_questions)
    return render_template(
        'quiz/quiz-base.html', data=test_data[quiz_questions[int(seq)-1]], format=quiz_question_format[int(seq)-1],
        seq=seq, response=get_quiz_response(seq), max=QUIZ_MAX
    )


def get_next_format():
    return (len(quiz_questions) + 1) % 3


def get_quiz_response(seq):
    if len(quiz_responses) >= int(seq):
        return quiz_responses[int(seq)-1]
    else:
        return -1


@app.route('/log-quiz-response/<seq>', methods=['POST'])
def log_quiz_response(seq=None):
    global quiz_last_answered
    response = request.get_json()
    print(response['response'])
    if int(seq) == len(quiz_responses) + 1:
        quiz_responses.append(response['response'])
        quiz_last_answered = int(seq)
    return {}


def random_number_not_in(given):
    while True:
        next_idx = (random.randint(100, 10000)) % 4
        if next_idx not in given:
            break
    return next_idx


def get_next_index():
    sandbox = False
    if quiz_question_format[-1] == 0:
        sandbox = True
    if len(quiz_questions) == 0:
        return random_number_not_in([])
    last_3 = quiz_questions[-3:]
    last = quiz_questions[-1]
    if sandbox:
        if 3 not in last_3:
            return random_number_not_in([last, 3])
    return random_number_not_in(last_3)


if __name__ == '__main__':
    #app.run(debug=True)
    app.run(host='0.0.0.0')
