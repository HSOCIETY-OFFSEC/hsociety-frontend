(function () {
  try {
    var themeOrder = ['light', 'black'];
    var stored = localStorage.getItem('hsociety-theme');
    var theme = themeOrder.indexOf(stored) !== -1 ? stored : 'dark';
    var root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
    var metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      var themeColorMap = {
        light: '#ffffff',
        black: '#000000'
      };
      metaThemeColor.setAttribute('content', themeColorMap[theme] || '#0a0f14');
    }
  } catch (e) {
    // No-op: keep defaults if storage is unavailable.
  }
})();
