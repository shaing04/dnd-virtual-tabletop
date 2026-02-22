console.log('MAIN JS LOADED');
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM ready');
  const playerBtn = document.getElementById('btn-player');
  const dmBtn = document.getElementById('btn-dm');

  if (playerBtn) {
    playerBtn.addEventListener('click', () => {
      console.log('player click');
      localStorage.setItem('vtt_role', 'Player');
      window.location.href = './player/player-creator.html';
    });
  }

  if (dmBtn) {
    dmBtn.addEventListener('click', () => {
      console.log('dm click');
      localStorage.setItem('vtt_role', 'Dungeon Master');
    });
  }
});
