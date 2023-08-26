function showLoadingSpinner() {
    // document.getElementById("loading-spinner").classList.remove('hidden');
    document.getElementById("loading-spinner").style.display ="flex"
  }
  
  // 데이터가 불러와진 후 로딩 스피너를 숨깁니다.
  function hideLoadingSpinner() {
    // document.getElementById("loading-spinner").classList.add('hidden');
    document.getElementById("loading-spinner").style.display ="none"
  }

  // window.onload = function () { hideLoadingSpinner(); }
  
  window.addEventListener("load", function() {
    hideLoadingSpinner();
  });