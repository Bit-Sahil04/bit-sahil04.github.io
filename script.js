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
const uploadJsonBtn = document.getElementById('upload-json-btn');
const jsonUploadInput = document.getElementById('json-upload');

parseBtn.onclick = () => {
    const content = sourceInput.value;
    if (!content.trim()) return;

    // Attempt to parse as raw JSON first
    try {
        questions = JSON.parse(content);
        if (Array.isArray(questions)) {
            errorMsg.style.display = 'none';
            showViewer();
            return;
        }
    } catch (e) {
        // If it fails, fallback to HTML/JS regex parsing
    }

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
            errorMsg.innerText = 'Could not find a valid JSON array or questionList variable in the pasted text.';
            errorMsg.style.display = 'block';
        }
    }
};

uploadJsonBtn.onclick = () => {
    jsonUploadInput.click();
};

jsonUploadInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            questions = JSON.parse(event.target.result);
            errorMsg.style.display = 'none';
            showViewer();
        } catch (err) {
            console.error('JSON Parse error:', err);
            errorMsg.innerText = 'Error parsing JSON file. Please ensure it is a valid JSON array.';
            errorMsg.style.display = 'block';
        }
    };
    reader.readAsText(file);
    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
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
                <div class="reasoning-header">
                    <div class="info-icon">i</div>
                    REASONING FROM DOCUMENT
                </div>
                <div class="reasoning">${q.answer_solution_english}</div>
            </div>
            ${q.ai_analysis ? `
            <div class="solution-panel">
                <div class="reasoning-header">
                    <div class="info-icon">i</div>
                    AI ANALYSIS
                </div>
                <div class="reasoning">${q.ai_analysis}</div>
            </div>
            ` : ''}
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
        const solutionPanels = card.querySelectorAll('.solution-panel');
        const options = card.querySelectorAll('.option');
        const correctIdx = parseInt(q.correct_answer);

        if (showAll) {
            solutionPanels.forEach(panel => panel.classList.add('visible'));
            options.forEach((opt, optIdx) => {
                if (optIdx === correctIdx) {
                    opt.classList.add('correct-auto');
                } else {
                    opt.classList.remove('correct-auto');
                }
            });
        } else {
            solutionPanels.forEach(panel => panel.classList.remove('visible'));
            options.forEach(opt => opt.classList.remove('correct-auto'));
        }
    });
}

globalToggle.onchange = updateGlobalVisibility;
