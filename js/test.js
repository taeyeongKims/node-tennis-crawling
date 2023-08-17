const locationSelect = document.getElementById('locationSelect');
const nextMonthButton = document.getElementById('nextMonth');

locationSelect.addEventListener('change', function() {
  if (locationSelect.value == 'sajik') {
    nextMonthButton.style.display = 'none'; // 버튼을 숨김
  } else {
    nextMonthButton.style.display = 'inline-block'; // 버튼을 보이게 함
  }
});
