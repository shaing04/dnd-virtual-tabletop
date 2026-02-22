let character = {};

function showStep(current, next) {
  document.getElementById(current).classList.add('hidden');
  document.getElementById(next).classList.remove('hidden');
}

function hasAllStats(stats) {
  return ['str', 'dex', 'con', 'int', 'wis', 'cha'].every((k) => !!stats?.[k]);
}

const d20 = document.getElementById('d20');

function setD20Face(value) {
  if (!d20) return;
  d20.setAttribute('data-face', String(value));
}

// ----- Step 1 -> Step 2 -----
document.getElementById('toStep2').addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const race = document.getElementById('race').value;
  const charClass = document.getElementById('charClass').value;
  const level = document.getElementById('level').value;

  if (!name || !race || !charClass || !level) {
    alert('Please complete all fields before continuing.');
    return;
  }

  character.name = name;
  character.race = race;
  character.class = charClass;
  character.level = Number(level);

  showStep('step1', 'step2');
});

// ----- Step 2 -> Step 3 -----
document.getElementById('toStep3').addEventListener('click', () => {
  if (!character.stats) {
    alert('You must roll your stats first.');
    return;
  }

  if (!hasAllStats(character.stats)) {
    alert('All six attributes must be rolled before continuing.');
    return;
  }

  showStep('step2', 'step3');
});

// ----- Back buttons -----
document.getElementById('backTo1').addEventListener('click', () => {
  showStep('step2', 'step1');
});

document.getElementById('backTo2').addEventListener('click', () => {
  showStep('step3', 'step2');
});

document.getElementById('backTo3').addEventListener('click', () => {
  showStep('step4', 'step3');
});

// ----- Step 3 -> Step 4 (validate HP/MP) -----
document.getElementById('toStep4').addEventListener('click', () => {
  const hpValue = document.getElementById('maxHp').value.trim();
  const mpValue = document.getElementById('mp').value.trim();

  const hp = Number(hpValue);
  const mp = mpValue ? Number(mpValue) : 0;

  if (!hpValue || !Number.isInteger(hp) || hp <= 0) {
    alert('HP must be a positive whole number.');
    return;
  }

  if (mpValue && (!Number.isInteger(mp) || mp < 0)) {
    alert('MP must be a non-negative whole number.');
    return;
  }

  character.hp = hp;
  character.mp = mp;

  showStep('step3', 'step4');
});

// ----- Finish (Step 4 -> Final) -----
document.getElementById('finish').addEventListener('click', () => {
  const backstory = document.getElementById('backstory').value.trim();
  character.backstory = backstory; // optional

  localStorage.setItem('character', JSON.stringify(character));
  displayCharacter();
  showStep('step4', 'final');
});

// ----- Dice (CSS cube) animation helpers -----
const dice = document.getElementById('dice3d');

function animateDice() {
  if (!dice) return;
  dice.style.animation = 'none';
  dice.offsetHeight; // reflow
  dice.style.animation = 'throwDice 1.2s ease-in-out forwards';
}

function rollStatCard(card) {
  const stat = card.dataset.stat;
  const valueDisplay = card.querySelector('.stat-value');

  card.classList.add('active');

  const value = Math.floor(Math.random() * 20) + 1;

  setD20Face(value);
  valueDisplay.textContent = value;

  character.stats = character.stats || {};
  character.stats[stat] = value;

  setTimeout(() => card.classList.remove('active'), 300);
}

// Roll all (animate once)
document.getElementById('rollAll').addEventListener('click', () => {
  const cards = document.querySelectorAll('.stat-card');

  animateDice();

  setTimeout(() => {
    cards.forEach((card, index) => {
      setTimeout(() => rollStatCard(card), index * 120);
    });
  }, 600);
});

// Reroll single (animate once)
document.querySelectorAll('.reroll-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.stat-card');
    if (!card) return;

    animateDice();
    setTimeout(() => rollStatCard(card), 600);
  });
});

// ----- Final page rendering -----
function statCard(label, value) {
  return `
    <div class="stat-card final-card">
      <h3>${label}</h3>
      <div class="stat-value">${value ?? '--'}</div>
    </div>
  `;
}

function displayCharacter() {
  const saved = JSON.parse(localStorage.getItem('character'));
  if (!saved) return;

  const meta = document.getElementById('characterMeta');
  meta.innerHTML = `
    <h2 class="final-name">${saved.name}</h2>
    <p class="final-subtitle">${saved.race} ${saved.class} | Level ${saved.level}</p>
  `;

  const grid = document.getElementById('characterStatsGrid');
  grid.innerHTML = `
    ${statCard('STR', saved.stats?.str)}
    ${statCard('DEX', saved.stats?.dex)}
    ${statCard('CON', saved.stats?.con)}
    ${statCard('INT', saved.stats?.int)}
    ${statCard('WIS', saved.stats?.wis)}
    ${statCard('CHA', saved.stats?.cha)}
    ${statCard('HP', saved.hp)}
    ${statCard('MP', saved.mp)}
  `;

  const backstoryBlock = document.getElementById('backstoryBlock');
  const story = (saved.backstory || '').trim();

  if (story) {
    backstoryBlock.classList.remove('hidden');
    backstoryBlock.innerHTML = `
      <h2 class="backstory-title">Backstory</h2>
      <p class="backstory-text"></p>
    `;
    backstoryBlock.querySelector('.backstory-text').textContent = story;
  } else {
    backstoryBlock.classList.add('hidden');
    backstoryBlock.innerHTML = '';
  }
}
