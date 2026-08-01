const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './questions';
const OUTPUT_DIR = '.';

// Read all JSON files
const topics = [];
const files = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
  topics.push({
    key: data.topic,
    displayName: data.displayName || data.topic,
    count: data.questions.length,
    questions: data.questions
  });
});

// --- Generate index.html ---
let topicCardsHTML = topics.map(t => `
  <a class="topic-card" href="/course-demo/practice/topic.html?topic=${t.key}">
    <h3>${t.displayName}</h3>
    <p>${t.count} Questions</p>
    <span class="question-count">${t.count} problems</span>
  </a>
`).join('');

const indexHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Practice Arena 🎮 | COL1000</title>
  <link rel="stylesheet" href="/course-demo/practice/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="main-content-wrap">
    <main>
      <h1>🎮 COL1000 Practice Arena</h1>
      <p>Earn XP, unlock badges, and revise Python through interactive challenges.</p>
      
      <div id="stats">
        <strong>XP:</strong> <span id="xp">0</span>
        <strong>Badges:</strong> <span id="badge-count">0</span>
      </div>

      <div class="topic-grid">
        <a class="topic-card featured-card" href="/course-demo/practice/all-questions.html">
          <h2>📚 Question Bank</h2>
          <p>Browse all practice questions organized by topic and difficulty.</p>
        </a>
        ${topicCardsHTML}
      </div>
    </main>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      document.getElementById("xp").textContent = localStorage.getItem("xp") || 0;
      let badges = JSON.parse(localStorage.getItem("badges") || "[]");
      document.getElementById("badge-count").textContent = badges.length;
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHTML);
console.log('✅ Generated index.html');

// --- Generate topic.html (single template that loads dynamically) ---
// This is a static template that uses URL params to load the right JSON
const topicHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Practice | COL1000</title>
  <link rel="stylesheet" href="/course-demo/practice/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!-- Confetti library for awards -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1"></script>
</head>
<body>
  <div class="main-content-wrap">
    <main>
      <div class="question-container" id="app">
        <!-- Dynamically rendered -->
      </div>
    </main>
  </div>

  <script>
    // Get topic from URL
    const params = new URLSearchParams(window.location.search);
    const topicKey = params.get('topic');

    // Load the questions from the JSON file
    async function loadQuestions() {
      try {
        const response = await fetch(\`/course-demo/practice/questions/\${topicKey}.json\`);
        if (!response.ok) throw new Error('Topic not found');
        const data = await response.json();
        return data;
      } catch (e) {
        document.getElementById('app').innerHTML = \`
          <h2>Topic not found</h2>
          <p>Please go back to the <a href="/course-demo/practice/">Practice Arena</a>.</p>
        \`;
        return null;
      }
    }

    // State
    let questions = [];
    let currentIndex = 0;
    let xp = parseInt(localStorage.getItem('xp') || '0');
    let badges = JSON.parse(localStorage.getItem('badges') || '[]');
    let answered = false;

    // Render the current question
    function render() {
      if (!questions || questions.length === 0) return;
      
      const q = questions[currentIndex];
      const total = questions.length;
      const levelClass = 'level-' + q.level.toLowerCase();
      
      const optionsHTML = q.choices.map((choice, idx) => \`
        <button onclick="selectAnswer(\${idx})" id="opt-\${idx}">
          \${String.fromCharCode(65 + idx)}. \${choice}
        </button>
      \`).join('');

      const hintHTML = q.hints && q.hints.length > 0 ? \`
        <div class="hint-box">
          <strong>💡 Hint:</strong> \${q.hints[0]}
        </div>
      \` : '';

      document.getElementById('app').innerHTML = \`
        <div class="progress-bar">
          <div class="fill" style="width: \${((currentIndex + 1) / total) * 100}%"></div>
        </div>
        
        <span class="level-badge \${levelClass}">\${q.level}</span>
        <div class="question-text">\${q.question}</div>
        \${q.code ? \`<pre>\${q.code}</pre>\` : ''}
        
        <div class="options" id="options-container">
          \${optionsHTML}
        </div>
        
        \${hintHTML}
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <span style="color: var(--text-secondary); font-size: 0.9rem;">
            Question \${currentIndex + 1} of \${total}
          </span>
          <span style="color: var(--primary); font-weight: 600;">
            XP: \${xp} 🏆
          </span>
        </div>

        <div class="nav-buttons">
          <button class="prev-btn" onclick="prevQuestion()" \${currentIndex === 0 ? 'disabled' : ''}>
            ⬅ Previous
          </button>
          <button class="next-btn" onclick="nextQuestion()" \${currentIndex === total - 1 ? 'disabled' : ''}>
            Next ➡
          </button>
        </div>
      \`;

      answered = false;
    }

    // Select an answer
    window.selectAnswer = function(idx) {
      if (answered) return;
      answered = true;

      const q = questions[currentIndex];
      const isCorrect = idx === q.answer;
      
      // Highlight correct/wrong
      document.querySelectorAll('.options button').forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('correct');
        if (i === idx && !isCorrect) btn.classList.add('wrong');
      });

      // Award XP
      if (isCorrect) {
        const earned = q.level === 'challenging' ? 15 : 
                       q.level === 'difficult' ? 10 : 
                       q.level === 'medium' ? 7 : 5;
        xp += earned;
        localStorage.setItem('xp', String(xp));
        
        // Celebration!
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });

        // Check for badge
        const badgeKey = \`badge_\${topicKey}_\${q.level}\`;
        if (!badges.includes(badgeKey)) {
          badges.push(badgeKey);
          localStorage.setItem('badges', JSON.stringify(badges));
          // Extra confetti for badge!
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 100,
              origin: { y: 0.5 }
            });
          }, 300);
        }

	// Random cat reaction
  const catReactions = ['🐱', '😺', '😸', '😻', '🙀', '🐈'];
  const cat = catReactions[Math.floor(Math.random() * catReactions.length)];
  
  // Show floating emoji
  const emoji = document.createElement('div');
  emoji.textContent = cat;
  emoji.style.cssText = `
    position: fixed; font-size: 3rem;
    animation: floatUp 1.5s ease-out forwards;
    pointer-events: none; z-index: 999;
  `;
  emoji.style.left = (Math.random() * 80 + 10) + '%';
  emoji.style.top = (Math.random() * 40 + 20) + '%';
  document.body.appendChild(emoji);
  setTimeout(() => emoji.remove(), 1500);
      }

      // Update XP display
      document.querySelector('#app .nav-buttons').innerHTML += \`
        <span style="color: \${isCorrect ? '#4CAF50' : '#EF5350'}; font-weight: 600;">
          \${isCorrect ? '✅ Correct! +' + (q.level === 'challenging' ? 15 : q.level === 'difficult' ? 10 : q.level === 'medium' ? 7 : 5) + ' XP' : '❌ Not quite'}
        </span>
      \`;
    };

    // Navigation
    window.prevQuestion = function() {
      if (currentIndex > 0) {
        currentIndex--;
        render();
      }
    };

    window.nextQuestion = function() {
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        render();
      }
    };

    // Initialize
    async function init() {
      const data = await loadQuestions();
      if (data) {
        questions = data.questions;
        render();
      }
    }

    init();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'topic.html'), topicHTML);
console.log('✅ Generated topic.html');
