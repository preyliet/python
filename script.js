/* ============================================================
   FUTUREMIRROR — script.js
   Handles: screen navigation, form steps, API call,
            demo fallback, result rendering, star canvas
   ============================================================ */


/* ──────────────────────────────────────
   MODULE: UI
   All DOM interaction and visual helpers
────────────────────────────────────── */
const UI = {

    /* Switch between hero / form / loading / results */
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById('screen-' + id).classList.add('active');
        window.scrollTo(0, 0);
    },

    /* ── Form step navigation ── */
    currentStep: 1,

    stepMeta: [
        { title: 'About You', sub: 'Step 1 of 3 — Your identity & goals' },
        { title: 'Your Habits', sub: 'Step 2 of 3 — Your daily routines' },
        { title: 'Your Mindset', sub: 'Step 3 of 3 — Challenges & motivation' },
    ],

    goStep(next) {
        const prev = this.currentStep;

        // Hide old step, show new step
        document.getElementById('step-' + prev).classList.remove('active');
        document.getElementById('step-' + next).classList.add('active');

        // Update step node styling
        const prevNode = document.getElementById('node-' + prev);
        prevNode.classList.remove('active');
        if (next > prev) prevNode.classList.add('done');
        else prevNode.classList.remove('done');

        document.getElementById('node-' + next).classList.add('active');
        document.getElementById('node-' + next).classList.remove('done');

        // Update connector lines
        if (prev <= 2) {
            const line = document.getElementById('line-' + prev);
            if (next > prev) line.classList.add('done');
            else line.classList.remove('done');
        }

        // Update header text
        document.getElementById('step-title').textContent = this.stepMeta[next - 1].title;
        document.getElementById('step-sub').textContent = this.stepMeta[next - 1].sub;

        this.currentStep = next;
    },

    /* Sync slider display value */
    syncSlider(name, value, suffix) {
        document.getElementById('sv-' + name).textContent = value + suffix;
    },

    /* Toggle the API key input panel */
    toggleApi() {
        document.getElementById('api-panel').classList.toggle('open');
    },
};


/* ──────────────────────────────────────
   MODULE: App
   Core application logic
────────────────────────────────────── */
const App = {

    /* ── Read all form values into one object ── */
    collectData() {
        return {
            name: (document.getElementById('inp-name').value || 'Friend').trim(),
            age: parseInt(document.getElementById('inp-age').value) || 17,
            goal: (document.getElementById('inp-goal').value || 'achieve my dreams').trim(),
            skills: (document.getElementById('inp-skills').value || 'new skills').trim(),
            study: document.getElementById('inp-study').value,
            sleep: document.getElementById('inp-sleep').value,
            exercise: document.getElementById('inp-exercise').value,
            screen: document.getElementById('inp-screen').value,
            challenge: (document.getElementById('inp-challenge').value || 'staying consistent').trim(),
            proud: (document.getElementById('inp-proud').value || 'working hard').trim(),
            motivation: document.getElementById('inp-motivation').value,
            apiKey: document.getElementById('inp-apikey').value.trim(),
        };
    },

    /* ── Main entry point: called when user clicks "Reveal My Future" ── */
    async generate() {
        const data = this.collectData();
        UI.showScreen('loading');
        this._startLoadingMessages();

        let result;
        if (data.apiKey) {
            // Real AI via Anthropic API
            try {
                result = await this.callClaudeAPI(data);
            } catch (error) {
                console.warn('API call failed, using demo data instead:', error);
                result = this.getDemoData(data);
            }
        } else {
            // Demo mode — no API key needed
            await this._delay(3200);
            result = this.getDemoData(data);
        }

        this._stopLoadingMessages();
        Render.all(data, result);
        UI.showScreen('results');
    },

    /* ── Reset everything back to the hero screen ── */
    restart() {
        UI.showScreen('hero');
        UI.goStep(1);
        // Reset all step nodes and lines
        ['node-1', 'node-2', 'node-3'].forEach(id => {
            document.getElementById(id).classList.remove('active', 'done');
        });
        ['line-1', 'line-2'].forEach(id => {
            document.getElementById(id).classList.remove('done');
        });
        document.getElementById('node-1').classList.add('active');
        document.getElementById('step-title').textContent = UI.stepMeta[0].title;
        document.getElementById('step-sub').textContent = UI.stepMeta[0].sub;
        UI.currentStep = 1;
    },

    /* ── Call Anthropic Claude API ── */
    async callClaudeAPI(data) {
        const prompt = `
You are FutureMirror, an emotionally intelligent AI oracle for teenagers.

User profile:
- Name: ${data.name}, Age: ${data.age}
- Goal: ${data.goal}
- Skills to learn: ${data.skills}
- Daily study: ${data.study} hours
- Sleep: ${data.sleep} hours/night
- Exercise: ${data.exercise} days/week
- Screen time: ${data.screen}
- Biggest challenge: ${data.challenge}
- Proud of: ${data.proud}
- Motivation level: ${data.motivation}

Return ONLY a valid JSON object — no markdown, no extra text:
{
  "current": {
    "y5":  "2-3 sentences describing life at age ${data.age + 5} if habits stay the same (honest, vivid)",
    "y10": "2-3 sentences describing life at age ${data.age + 10} if habits stay the same (honest)"
  },
  "improved": {
    "y5":  "2-3 sentences describing life at age ${data.age + 5} with improved habits (inspiring)",
    "y10": "2-3 sentences describing life at age ${data.age + 10} with improved habits (motivating)"
  },
  "tips": [
    { "habit": "Habit name", "tip": "1-2 sentence actionable advice" },
    { "habit": "Habit name", "tip": "1-2 sentence actionable advice" },
    { "habit": "Habit name", "tip": "1-2 sentence actionable advice" }
  ],
  "letter": "A 4-5 sentence personal letter from ${data.name} at age ${data.age + 10}. Start with 'Dear ${data.name},'. Reference the goal '${data.goal}'. Be warm, emotional, and deeply motivating."
}`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': data.apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1200,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        const json = await response.json();
        return JSON.parse(json.content[0].text);
    },

    /* ── Demo data (used when no API key is provided) ── */
    getDemoData(d) {
        const n = d.name, g = d.goal, a = d.age;
        return {
            current: {
                y5: `At ${a + 5}, ${n} finds life moving forward but not quite in the direction once imagined. The dream of ${g} is still present, but inconsistent habits have quietly widened the gap between ambition and action. There are glimpses of the future that was envisioned, but they feel more distant than they should.`,
                y10: `By ${a + 10}, ${n} has settled into a stable but unfulfilling rhythm. The potential for ${g} was always there — the tools just weren't built in time. Looking back, the small daily choices seem far more significant than they did when they were being made.`,
            },
            improved: {
                y5: `At ${a + 5}, ${n} carries the quiet confidence of someone who chose to show up when it was hard. The consistent investment in study, rest, and skill-building has already opened doors that once seemed impossibly far. Progress toward ${g} is not a distant hope anymore — it is a visible, accelerating reality.`,
                y10: `By ${a + 10}, ${n} has turned the vision of ${g} into a story worth telling. Every small habit compounded into something remarkable. When people ask how it happened, the answer is always the same: I decided who I wanted to be, and I acted like it before I felt ready.`,
            },
            tips: [
                {
                    habit: 'Daily Study',
                    tip: `45 focused minutes on ${d.skills || 'your craft'} each morning — before distractions start — is worth more than three scattered hours at night. Protect that window like your most important appointment.`,
                },
                {
                    habit: 'Sleep Discipline',
                    tip: `Your brain consolidates learning during deep sleep. A consistent bedtime is not a small habit — it is the foundation everything else is built on. Try holding the same time for just 21 days.`,
                },
                {
                    habit: 'Screen Awareness',
                    tip: `Redirect only 30 minutes of daily scrolling toward your goal. That single shift adds up to 182 hours per year — more than a full month of focused progress toward ${g}.`,
                },
            ],
            letter: `Dear ${n}, it's you — writing from ${a + 10} years ahead, and I want you to hear this clearly: everything you are uncertain about right now is not the obstacle you think it is. The day you chose to build toward ${g} with real consistency rewrote everything that followed. I know it feels distant right now, almost borrowed from someone else's life — but it isn't. The version of you writing this letter is proud, calm, and genuinely happy. Start today. I am already proof that you can. — Future ${n}`,
        };
    },

    /* ── Loading message cycle ── */
    _loadInterval: null,
    _loadMessages: [
        'Analyzing your habits...',
        'Mapping the timelines...',
        'Calculating trajectories...',
        'Composing your futures...',
        'Writing your letter...',
    ],

    _startLoadingMessages() {
        let i = 0;
        const el = document.getElementById('load-msg');
        el.textContent = this._loadMessages[0];
        this._loadInterval = setInterval(() => {
            i = (i + 1) % this._loadMessages.length;
            el.textContent = this._loadMessages[i];
        }, 2200);
    },

    _stopLoadingMessages() {
        clearInterval(this._loadInterval);
    },

    /* Small utility: pause execution */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
};


/* ──────────────────────────────────────
   MODULE: Render
   Builds the HTML for the results screen
────────────────────────────────────── */
const Render = {

    /* Entry point — calls all sub-renderers */
    all(data, result) {
        this.header(data);
        this.scores(data);
        this.paths(data, result);
        this.tips(result);
        this.letter(result);
    },

    /* Results masthead */
    header(data) {
        document.getElementById('res-name').textContent =
            `${data.name}'s Oracle Report`;
        document.getElementById('res-sub').textContent =
            `Habit analysis · Future projections · ${data.goal}`;
    },

    /* § I — Habit score cards with animated fill bars */
    scores(data) {
        // Convert raw values to 0–100 scores
        const studyScore = Math.min(100, (parseFloat(data.study) / 10) * 100);
        const sleepScore = Math.min(100, Math.max(0, ((parseFloat(data.sleep) - 4) / 6) * 100));
        const exerciseScore = Math.min(100, (parseFloat(data.exercise) / 7) * 100);
        const screenScores = { 'under 1 hour': 100, '1-2 hours': 72, '3-4 hours': 42, '5+ hours': 18 };
        const screenScore = screenScores[data.screen] ?? 60;

        const items = [
            { label: 'Study', score: studyScore, unit: data.study + 'h / day' },
            { label: 'Sleep', score: sleepScore, unit: data.sleep + 'h / night' },
            { label: 'Exercise', score: exerciseScore, unit: data.exercise + ' days / wk' },
            { label: 'Screen Balance', score: screenScore, unit: data.screen },
        ];

        document.getElementById('scores-grid').innerHTML = items.map(item => `
      <div class="score-card">
        <div class="sc-label">${item.label}</div>
        <div class="sc-track">
          <div class="sc-fill" data-score="${item.score}"></div>
        </div>
        <div class="sc-big">
          ${Math.round(item.score)}<span class="sc-denom"> / 100</span>
        </div>
        <div class="sc-unit">${item.unit}</div>
      </div>
    `).join('');

        // Animate the fill bars after a short delay (so transition fires)
        setTimeout(() => {
            document.querySelectorAll('.sc-fill').forEach(bar => {
                bar.style.width = bar.dataset.score + '%';
            });
        }, 120);
    },

    /* § II — Current vs Improved future cards */
    paths(data, result) {
        const age5 = data.age + 5;
        const age10 = data.age + 10;

        document.getElementById('paths-grid').innerHTML = `
      <div class="path-card current">
        <div class="path-badge current">▪ Current Trajectory</div>
        <div class="path-title">If Habits Stay The Same</div>
        <div class="timeline">
          <div class="timeline-item">
            <div class="tl-year">In 5 Years · Age ${age5}</div>
            <div class="tl-text">${result.current.y5}</div>
          </div>
          <div class="timeline-item">
            <div class="tl-year">In 10 Years · Age ${age10}</div>
            <div class="tl-text">${result.current.y10}</div>
          </div>
        </div>
      </div>

      <div class="path-card improved">
        <div class="best-stamp">✦ BEST PATH</div>
        <div class="path-badge improved">▪ Your Full Potential</div>
        <div class="path-title">If You Improve Your Habits</div>
        <div class="timeline">
          <div class="timeline-item">
            <div class="tl-year">In 5 Years · Age ${age5}</div>
            <div class="tl-text">${result.improved.y5}</div>
          </div>
          <div class="timeline-item">
            <div class="tl-year">In 10 Years · Age ${age10}</div>
            <div class="tl-text">${result.improved.y10}</div>
          </div>
        </div>
      </div>
    `;
    },

    /* § III — Growth tip cards */
    tips(result) {
        document.getElementById('tips-grid').innerHTML = result.tips.map(tip => `
      <div class="tip-card">
        <div class="tip-habit">▸ ${tip.habit}</div>
        <div class="tip-text">${tip.tip}</div>
      </div>
    `).join('');
    },

    /* § IV — Letter with typewriter animation */
    letter(result) {
        const container = document.getElementById('letter-body');
        container.innerHTML = '<span class="cursor"></span>';

        const text = result.letter;
        const cursor = container.querySelector('.cursor');
        let index = 0;

        // Start typing after a short pause
        setTimeout(() => {
            const interval = setInterval(() => {
                if (index < text.length) {
                    cursor.insertAdjacentText('beforebegin', text[index]);
                    index++;
                } else {
                    clearInterval(interval);
                    cursor.remove();
                }
            }, 16); // ~60 chars/sec
        }, 600);
    },
};


/* ──────────────────────────────────────
   MODULE: Stars
   Draws twinkling stars on a <canvas>
────────────────────────────────────── */
const Stars = {

    canvas: null,
    ctx: null,
    stars: [],

    init() {
        this.canvas = document.getElementById('star-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createStars();
        this.animate();
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
        });
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createStars() {
        // 160 stars with random position, size, and fade speed
        this.stars = Array.from({ length: 160 }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            r: Math.random() * 1.1 + 0.2,
            opacity: Math.random() * 0.6 + 0.1,
            opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.007,
        }));
    },

    animate() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.stars.forEach(star => {
            // Gently pulse each star's opacity
            star.opacity += star.opacityDir;
            if (star.opacity > 0.75 || star.opacity < 0.08) {
                star.opacityDir *= -1;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 225, 255, ${star.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    },
};


/* ──────────────────────────────────────
   BOOT — runs when page loads
────────────────────────────────────── */
Stars.init();
