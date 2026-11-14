// React가 시작되기 전에 모드를 적용해 첫 화면의 색상 깜빡임을 줄인다.
(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('coffee-theme');
    if (['light', 'dark', 'system'].includes(saved)) preference = saved;
  } catch {
    // 저장소를 사용할 수 없는 환경에서는 기기 설정을 따른다.
  }

  const dark = preference === 'dark'
    || (preference === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.dataset.theme = preference;
})();
