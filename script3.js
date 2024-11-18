document.getElementById('menu-container').addEventListener('click', function() {
  this.classList.toggle('open');
});

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
}
