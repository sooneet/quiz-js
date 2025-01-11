// Function to fetch quiz data from Google Sheets
async function fetchQuizData(subject, setName) {
    const sheetUrl = 'https://spreadsheets.google.com/feeds/list/2PACX-1vRqlyHpZp1H0gGq5yH_yOAlMTKQ_kRUZuiBQkKaYWx_2pNYyyLZOLiY1qCEP2a0qhZyZvNK6e8ER3rc/od6/public/values?alt=json';
    const response = await fetch(sheetUrl);
    const data = await response.json();
    const entries = data.feed.entry;

    // Filter data based on subject and set
    return entries.filter(entry =>
        entry.gsx$subject.$t === subject && entry.gsx$setname.$t === setName
    ).map(entry => ({
        question: entry.gsx$question.$t,
        options: [
            entry.gsx$optiona.$t,
            entry.gsx$optionb.$t,
            entry.gsx$optionc.$t,
            entry.gsx$optiond.$t
        ],
        correct: entry.gsx$correctanswer.$t
    }));
}

// Function to render the quiz
async function renderQuiz(container) {
    const subject = container.getAttribute('data-subject');
    const setName = container.getAttribute('data-set');
    const quizData = await fetchQuizData(subject, setName);

    let html = '';
    quizData.forEach((q, index) => {
        html += `<div class="question">
            <p>${index + 1}. ${q.question}</p>
            ${q.options.map((opt, i) => `
                <label>
                    <input type="radio" name="q${index}" value="${opt}">
                    ${opt}
                </label>
            `).join('')}
        </div>`;
    });

    container.innerHTML = html + `<button id="submit-quiz">Submit</button>`;

    // Handle quiz submission
    document.getElementById('submit-quiz').addEventListener('click', () => {
        let score = 0;
        quizData.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            if (selected && selected.value === q.correct) score++;
        });
        alert(`Your score: ${score}/${quizData.length}`);
    });
}

// Initialize quizzes on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#quiz-container').forEach(container => renderQuiz(container));
});
