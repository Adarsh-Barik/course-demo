const fs = require('fs');
const path = require('path');

const QUESTIONS_DIR = './questions';
const OUTPUT_DIR = '.';

// Read all JSON files and build topics list
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

// Write a manifest file (list of topic keys) for the frontend to fetch
fs.writeFileSync(path.join(QUESTIONS_DIR, 'manifest.json'), JSON.stringify(topics.map(t => t.key)));
console.log('✅ Generated manifest.json');

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
        <a class="topic-card featured-card" href="/course-demo/practice/topic.html">
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

// --- Generate topic.html ---
const topicHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Practice | COL1000</title>
  <link rel="stylesheet" href="/course-demo/practice/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1"><\/script>
  <style>
    @keyframes floatUp {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-100px) scale(1.5); }
    }
    @keyframes popIn {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    /* All-questions list styles */
    .question-block {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      margin-bottom: 1.5rem;
      border-left: 4px solid var(--primary-light);
    }
    .question-block .level-badge {
      display: inline-block;
      padding: 0.2rem 0.8rem;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }
    .question-block .question-text {
      font-weight: 500;
      margin: 0.5rem 0;
    }
    .question-block pre {
      background: #1A2332;
      color: #E3E8F0;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.85rem;
      margin: 0.5rem 0;
    }
    .question-block .choices {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin: 0.5rem 0;
    }
    .question-block .choices button {
      background: var(--bg);
      border: 1px solid #ddd;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-align: left;
      font-size: 0.95rem;
      cursor: default;
    }
    .question-block .choices button.correct-reveal {
      background: #E8F5E9;
      border-color: #4CAF50;
    }
    .question-block .choices button.wrong-reveal {
      background: #FFEBEE;
      border-color: #EF5350;
    }
    .question-block .reveal-btn {
      margin-top: 0.5rem;
      padding: 0.3rem 1rem;
      border: none;
      border-radius: 6px;
      background: var(--primary);
      color: white;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .question-block .reveal-btn:hover {
      background: var(--primary-dark);
    }
    .question-block .hint-box {
      background: #FFF8E1;
      padding: 0.8rem 1rem;
      border-radius: 6px;
      border-left: 4px solid #FFC107;
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: #4A3A00;
      display: none;
    }
    .question-block .hint-box.visible {
      display: block;
    }
    .question-block .answer-feedback {
      margin-top: 0.5rem;
      font-weight: 500;
    }
  </style>
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

    // Load the questions
    async function loadQuestions() {
      try {
        if (topicKey) {
          // Single topic
          const response = await fetch('/course-demo/practice/questions/' + topicKey + '.json');
          if (!response.ok) throw new Error('Topic not found');
          const data = await response.json();
          data.isAll = false;
          return data;
        } else {
          // All topics (Question Bank)
          const manifestResponse = await fetch('/course-demo/practice/questions/manifest.json');
          if (!manifestResponse.ok) throw new Error('Manifest not found');
          const topicKeys = await manifestResponse.json();
          let allQuestions = [];
          for (const key of topicKeys) {
            const resp = await fetch('/course-demo/practice/questions/' + key + '.json');
            if (resp.ok) {
              const data = await resp.json();
              allQuestions = allQuestions.concat(data.questions.map(q => ({ ...q, topic: data.displayName || key })));
            }
          }
          return { topic: 'all', displayName: 'All Topics', questions: allQuestions, isAll: true };
        }
      } catch (e) {
        document.getElementById('app').innerHTML =
          '<h2>Error loading questions</h2><p>Please go back to the <a href="/course-demo/practice/">Practice Arena</a>.</p>';
        return null;
      }
    }

    // State for single-topic mode
    let questions = [];
    let currentIndex = 0;
    let xp = parseInt(localStorage.getItem('xp') || '0');
    let badges = JSON.parse(localStorage.getItem('badges') || '[]');
    let answered = false;
    let isAllMode = false;

    // Show floating emoji (for single mode)
    function showFloatingEmoji(emoji) {
      const el = document.createElement('div');
      el.textContent = emoji;
      el.style.cssText = 'position: fixed; font-size: 3rem; animation: floatUp 1.5s ease-out forwards; pointer-events: none; z-index: 999;';
      el.style.left = (Math.random() * 80 + 10) + '%';
      el.style.top = (Math.random() * 40 + 20) + '%';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }

    // Show badge unlock popup
    function showBadgeUnlock(badgeName) {
      const emojis = ['🐱', '🌟', '🎉', '🏅', '🌈', '🦄', '🚀', '🎊'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      const popup = document.createElement('div');
      popup.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem 3rem; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; z-index: 1000; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: 3px solid #FFD700;';
      popup.innerHTML = '<div style="font-size: 4rem;">' + randomEmoji + '</div><h2 style="margin: 0.5rem 0; color: #1A2332;">Badge Unlocked!</h2><p style="color: #5A6B7C;">' + badgeName + '</p><button onclick="this.parentElement.remove()" style="margin-top: 1rem; padding: 0.5rem 2rem; border: none; background: #4A6CF7; color: white; border-radius: 10px; cursor: pointer; font-weight: 600;">🎮 Continue</button>';
      document.body.appendChild(popup);
      
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 }
      });
    }

    // Render function
    function render() {
      if (!questions || questions.length === 0) return;

      if (isAllMode) {
        // --- All Questions Mode ---
        let html = '<h2>📚 Question Bank</h2><p>All questions from all topics are listed below. Click "Reveal Answer" to check your understanding.</p>';
        questions.forEach((q, idx) => {
          const levelClass = 'level-' + q.level.toLowerCase();
          let choicesHTML = '';
          q.choices.forEach((choice, ci) => {
            choicesHTML += '<button data-answer="' + (ci === q.answer ? '1' : '0') + '">' + String.fromCharCode(65 + ci) + '. ' + choice + '</button>';
          });
          html += '<div class="question-block" id="qblock-' + idx + '">';
          html += '<span class="level-badge ' + levelClass + '">' + q.level + (q.topic ? ' • ' + q.topic : '') + '</span>';
          html += '<div class="question-text">' + q.question + '</div>';
          if (q.code) html += '<pre>' + q.code + '</pre>';
          html += '<div class="choices">' + choicesHTML + '</div>';
          html += '<button class="reveal-btn" onclick="revealAnswer(' + idx + ')">🔍 Reveal Answer</button>';
          html += '<div class="hint-box" id="hint-' + idx + '">';
          if (q.hints && q.hints.length > 0) {
            html += '<strong>💡 Hint:</strong> ' + q.hints[0];
          }
          html += '</div>';
          html += '<div class="answer-feedback" id="feedback-' + idx + '"></div>';
          html += '</div>';
        });
        document.getElementById('app').innerHTML = html;
        return;
      }

      // --- Single Question Mode (Original) ---
      const q = questions[currentIndex];
      const total = questions.length;
      const levelClass = 'level-' + q.level.toLowerCase();
      
      let optionsHTML = '';
      for (let i = 0; i < q.choices.length; i++) {
        optionsHTML += '<button onclick="selectAnswer(' + i + ')" id="opt-' + i + '">' + String.fromCharCode(65 + i) + '. ' + q.choices[i] + '</button>';
      }

      let codeHTML = q.code ? '<pre>' + q.code + '</pre>' : '';

      document.getElementById('app').innerHTML =
        '<div class="progress-bar"><div class="fill" style="width: ' + ((currentIndex + 1) / total * 100) + '%"></div></div>' +
        '<span class="level-badge ' + levelClass + '">' + q.level + '</span>' +
        '<div class="question-text">' + q.question + '</div>' +
        codeHTML +
        '<div class="options" id="options-container">' + optionsHTML + '</div>' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">' +
          '<span style="color: #5A6B7C; font-size: 0.9rem;">Question ' + (currentIndex + 1) + ' of ' + total + '</span>' +
          '<span style="color: #4A6CF7; font-weight: 600;">XP: ' + xp + ' 🏆</span>' +
        '</div>' +
        '<div class="nav-buttons">' +
          '<button class="prev-btn" onclick="prevQuestion()" ' + (currentIndex === 0 ? 'disabled' : '') + '>⬅ Previous</button>' +
          '<button class="next-btn" onclick="nextQuestion()" ' + (currentIndex === total - 1 ? 'disabled' : '') + '>Next ➡</button>' +
        '</div>';

      answered = false;
    }

    // Reveal answer for all-questions mode
    window.revealAnswer = function(idx) {
      const q = questions[idx];
      const block = document.getElementById('qblock-' + idx);
      const choices = block.querySelectorAll('.choices button');
      const feedback = document.getElementById('feedback-' + idx);
      const hintBox = document.getElementById('hint-' + idx);

      // Mark correct and wrong choices
      choices.forEach((btn, ci) => {
        btn.style.cursor = 'default';
        if (ci === q.answer) {
          btn.classList.add('correct-reveal');
        } else {
          btn.classList.add('wrong-reveal');
        }
      });

      // Show hint
      if (q.hints && q.hints.length > 0) {
        hintBox.classList.add('visible');
      }

      feedback.textContent = '✅ Correct answer is: ' + q.choices[q.answer];
      // Disable the reveal button
      block.querySelector('.reveal-btn').disabled = true;
      block.querySelector('.reveal-btn').style.opacity = '0.5';
    };

    // Single-question select
    window.selectAnswer = function(idx) {
      if (answered) return;
      answered = true;

      const q = questions[currentIndex];
      const isCorrect = idx === q.answer;
      
      const btns = document.querySelectorAll('.options button');
      btns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('correct');
        if (i === idx && !isCorrect) btn.classList.add('wrong');
      });

      if (isCorrect) {
        let earned = 5;
        if (q.level === 'challenging') earned = 15;
        else if (q.level === 'difficult') earned = 10;
        else if (q.level === 'medium') earned = 7;
        
        xp += earned;
        localStorage.setItem('xp', String(xp));
        
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        const catReactions = ['🐱', '😺', '😸', '😻', '🙀', '🐈'];
        showFloatingEmoji(catReactions[Math.floor(Math.random() * catReactions.length)]);

        const badgeKey = 'badge_' + topicKey + '_' + q.level;
        if (!badges.includes(badgeKey)) {
          badges.push(badgeKey);
          localStorage.setItem('badges', JSON.stringify(badges));
          setTimeout(() => {
            confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
          }, 300);
          showBadgeUnlock('Topic: ' + topicKey + ' - ' + q.level.charAt(0).toUpperCase() + q.level.slice(1));
        }
      } else {
        // Show hint if available
        if (q.hints && q.hints.length > 0 && !document.querySelector('.hint-box')) {
          const hintBox = document.createElement('div');
          hintBox.className = 'hint-box';
          hintBox.innerHTML = '<strong>💡 Hint:</strong> ' + q.hints[0];
          const optionsContainer = document.getElementById('options-container');
          optionsContainer.parentNode.insertBefore(hintBox, optionsContainer.nextSibling);
        }
      }

      const feedback = document.createElement('span');
      feedback.style.cssText = 'font-weight: 600; margin-left: 1rem;';
      feedback.textContent = isCorrect ? '✅ Correct! +' + earned + ' XP' : '❌ Not quite';
      document.querySelector('.nav-buttons').appendChild(feedback);
    };

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

    async function init() {
      const data = await loadQuestions();
      if (data) {
        questions = data.questions;
        isAllMode = data.isAll || false;
        render();
      }
    }

    init();
  <\/script>
</body>
</html>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'topic.html'), topicHTML);
console.log('✅ Generated topic.html');
