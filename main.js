document.addEventListener('DOMContentLoaded', () => {
  const playerBtn = document.getElementById('btn-player');
  const dmBtn = document.getElementById('btn-dm');

  // Handle Player Selection
  playerBtn.addEventListener('click', () => {
    // Save state locally to mimic a backend session
    localStorage.setItem('vtt_role', 'Player');

    console.log('Role saved as: Player');

    // Uncomment this when you create the player HTML file
    // window.location.href = 'player-dashboard.html';

    alert('Welcome, Adventurer! Redirecting to Player Dashboard...');
  });

  // Handle DM Selection
  dmBtn.addEventListener('click', () => {
    // Save state locally
    localStorage.setItem('vtt_role', 'Dungeon Master');

    console.log('Role saved as: Dungeon Master');

    // Uncomment this when you create the DM HTML file
    // window.location.href = 'dm-dashboard.html';

    alert('Welcome, Game Master! Redirecting to DM Dashboard...');
  });
});
