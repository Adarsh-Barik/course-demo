const params =
    new URLSearchParams(
        window.location.search
    );

const topic =
    params.get("topic");

document.getElementById(
    "topic-name"
).innerText =
topic.toUpperCase();

let wrongAttempts = 0;

updateXP();

fetch(
    `questions/${topic}.json`
)
.then(r=>r.json())
.then(questions=>{

let current = 0;

document
.getElementById(
    "question-total"
)
.textContent =
questions.length;

render();

function render(){

    const q =
        questions[current];

    document
    .getElementById(
        "question-number"
    )
    .textContent =
    current + 1;

    document
    .getElementById(
        "progress"
    )
    .style.width =
    `${100*(current)/
      questions.length}%`;

    let html = `

    <div class="question-card">

    <span
        class="badge ${q.level}">

        ${q.level.toUpperCase()}

    </span>

    <pre>${q.code}</pre>

    <p>

    ${q.question}

    </p>

    `;

    q.choices.forEach((c,i)=>{

        html += `

        <label
            class="choice">

        <input
            type="radio"
            name="choice"
            value="${i}">

        ${c}

        </label>
        `;
    });

    html += `

    <button
        onclick="checkAnswer()">

    Submit

    </button>

    <div id="feedback">

    </div>

    </div>
    `;

    document
    .getElementById(
        "question-container"
    ).innerHTML = html;
}

window.checkAnswer =
function(){

    const selected =
    document.querySelector(
    'input[name="choice"]:checked'
    );

    if(!selected)
        return;

    const q =
        questions[current];

    if(
        parseInt(
            selected.value
        ) === q.answer
    ){

        awardXP(q.level);

        current++;

        wrongAttempts = 0;

        if(
            current >=
            questions.length
        ){

            completeTopic(
                topic
            );

            document
            .getElementById(
                "question-container"
            ).innerHTML =

            `<div class="completion-card">

            <h2>

            🏆 Topic Completed!

            </h2>

            <p>

            Badge unlocked.

            </p>

            <p>

            Current XP:

            <strong>

            ${
            localStorage
            .getItem("xp")
            }

            </strong>

            </p>

            <a href="../practice/">

            Return to Practice Arena

            </a>

            </div>`;

            return;
        }

        render();

    }else{

        wrongAttempts++;

        const hint =
            q.hints[
                Math.min(
                    wrongAttempts-1,
                    q.hints.length-1
                )
            ];

        document
        .getElementById(
            "feedback"
        ).innerHTML =

        `<p class="incorrect">

        Hint:
        ${hint}

        </p>`;
    }

};

});

function updateXP(){

document
.getElementById(
    "xp-display"
)
.textContent =
localStorage
.getItem("xp") || 0;

}

function awardXP(level){

let xp =
parseInt(
localStorage.getItem("xp")
|| "0"
);

if(level==="easy")
xp += 10;

if(level==="medium")
xp += 20;

if(level==="hard")
xp += 40;

localStorage.setItem(
"xp",
xp
);

updateXP();

}

function completeTopic(topic){

let badges =
JSON.parse(
localStorage.getItem(
"badges"
) || "[]"
);

if(
!badges.includes(topic)
){
badges.push(topic);
}

localStorage.setItem(
"badges",
JSON.stringify(
badges
)
);

}
