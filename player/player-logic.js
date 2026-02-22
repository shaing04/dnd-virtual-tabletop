let character = {};

function showStep(current, next) {
  document.getElementById(current).classList.add('hidden');
  document.getElementById(next).classList.remove('hidden');
}

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
  character.level = level;

  showStep('step1', 'step2');
});

document.getElementById('toStep3').addEventListener('click', () => {
  // Ensure stats object exists
  if (!character.stats) {
    alert('You must roll your stats first.');
    return;
  }

  const stats = character.stats;

  const missingStat = ['str', 'dex', 'con', 'int', 'wis', 'cha'].some(
    (stat) => !stats[stat],
  );

  if (missingStat) {
    alert('All six attributes must be rolled before continuing.');
    return;
  }

  showStep('step2', 'step3');
});

document
  .getElementById('backTo1')
  .addEventListener('click', () => showStep('step2', 'step1'));
document
  .getElementById('backTo2')
  .addEventListener('click', () => showStep('step3', 'step2'));

document.getElementById('finish').addEventListener('click', () => {
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

  localStorage.setItem('character', JSON.stringify(character));
  displayCharacter();
  showStep('step3', 'final');
});

const dice = document.getElementById('dice3d');

function animateDice() {
  dice.style.animation = 'none';
  dice.offsetHeight;
  dice.style.animation = 'throwDice 1.2s ease-in-out forwards';
}

function rollStatCard(card) {
  const stat = card.dataset.stat;
  const valueDisplay = card.querySelector('.stat-value');

  card.classList.add('active');

  const value = Math.floor(Math.random() * 20) + 1;
  valueDisplay.textContent = value;

  character.stats = character.stats || {};
  character.stats[stat] = value;

  setTimeout(() => {
    card.classList.remove('active');
  }, 300);
}

document.getElementById('rollAll').addEventListener('click', () => {
  const cards = document.querySelectorAll('.stat-card');

  animateDice(); // animate once

  setTimeout(() => {
    cards.forEach((card, index) => {
      setTimeout(() => {
        rollStatCard(card);
      }, index * 120);
    });
  }, 600);
});

document.querySelectorAll('.reroll-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.stat-card');

    animateDice(); // animate once
    setTimeout(() => {
      rollStatCard(card);
    }, 600);
  });
});

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

  // Header/meta
  const meta = document.getElementById('characterMeta');
  meta.innerHTML = `
    <h2 class="final-name">${saved.name}</h2>
    <p class="final-subtitle">${saved.race} ${saved.class} | Level ${saved.level}</p>
  `;

  // Stat cards
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
}
