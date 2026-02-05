let questions = [];
const inputView = document.getElementById('input-view');
const viewerView = document.getElementById('viewer-view');
const sourceInput = document.getElementById('source-input');
const parseBtn = document.getElementById('parse-btn');
const backBtn = document.getElementById('back-btn');
const errorMsg = document.getElementById('error-msg');
const questionsList = document.getElementById('questions-list');
const testTitle = document.getElementById('test-title');
const globalToggle = document.getElementById('global-solution-toggle');

parseBtn.onclick = () => {
    const content = sourceInput.value;
    if (!content.trim()) return;

    // JavaScript regex equivalent to the Python script
    // Note: 's' flag (dotAll) allows . to match newlines
    const regex = /var\s+questionList\s*=\s*(\[.*?\]);/s;
    const match = content.match(regex);

    if (match && match[1]) {
        try {
            questions = JSON.parse(match[1]);
            errorMsg.style.display = 'none';
            showViewer();
        } catch (e) {
            console.error('JSON Parse error:', e);
            errorMsg.innerText = 'Error parsing question data. Ensure the text is complete.';
            errorMsg.style.display = 'block';
        }
    } else {
        // Try fallback without semicolon
        const fallbackRegex = /var\s+questionList\s*=\s*(\[.*\])/s;
        const fallbackMatch = content.match(fallbackRegex);
        if (fallbackMatch && fallbackMatch[1]) {
            try {
                questions = JSON.parse(fallbackMatch[1]);
                errorMsg.style.display = 'none';
                showViewer();
            } catch (e) {
                errorMsg.innerText = 'Error parsing question data.';
                errorMsg.style.display = 'block';
            }
        } else {
            errorMsg.innerText = 'Could not find questionList variable in the pasted text.';
            errorMsg.style.display = 'block';
        }
    }
};

backBtn.onclick = () => {
    inputView.style.display = 'flex';
    viewerView.style.display = 'none';
    globalToggle.checked = false;
};

function showViewer() {
    inputView.style.display = 'none';
    viewerView.style.display = 'block';
    renderAllQuestions();
}

function renderAllQuestions() {
    if (questions.length === 0) return;

    testTitle.innerText = questions[0].mock_Test_Name || 'Questionnaire';
    questionsList.innerHTML = '';

    questions.forEach((q, idx) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="question-meta">
                <span>Question ${idx + 1} of ${questions.length}</span>
                <span>ID: ${q.id}</span>
            </div>
            <div class="question-text">${q.main_question}</div>
            <div class="options-container"></div>
            <div class="solution-panel">
                <div style="font-weight: 800; margin-bottom: 10px; color: var(--primary-color);">REASONING / SOLUTION</div>
                <div class="reasoning">${q.answer_solution_english}</div>
            </div>
        `;

        const optionsContainer = card.querySelector('.options-container');

        q.options.forEach((opt, optIdx) => {
            if (!opt) return;
            const optDiv = document.createElement('div');
            optDiv.className = 'option';
            optDiv.innerHTML = `
                <span style="font-weight:bold; min-width:24px;">${String.fromCharCode(65 + optIdx)}.</span>
                <div class="opt-content">${opt}</div>
            `;
            optionsContainer.appendChild(optDiv);
        });

        questionsList.appendChild(card);
    });

    updateGlobalVisibility();
}

function updateGlobalVisibility() {
    const showAll = globalToggle.checked;

    questions.forEach((q, idx) => {
        const card = questionsList.children[idx];
        const solutionPanel = card.querySelector('.solution-panel');
        const options = card.querySelectorAll('.option');
        const correctIdx = parseInt(q.correct_answer);

        if (showAll) {
            solutionPanel.classList.add('visible');
            options.forEach((opt, optIdx) => {
                if (optIdx === correctIdx) {
                    opt.classList.add('correct-auto');
                } else {
                    opt.classList.remove('correct-auto');
                }
            });
        } else {
            solutionPanel.classList.remove('visible');
            options.forEach(opt => opt.classList.remove('correct-auto'));
        }
    });
}

globalToggle.onchange = updateGlobalVisibility;
