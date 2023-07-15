function selectNavigation() {
  if (window.navigation) {
    return window.navigation;
  }

  return require('app/components/CreateNavigationContext').navigation;
}

export function goToPreviousRoute(navigate, fallBack) {
  const navigation = selectNavigation();

  if (navigation.canGoBack) {
    const currentEntry = navigation.currentEntry;
    const entries = navigation.entries();

    const currPath = currentEntry.url.split('?')[0];
    const currentIdx = currentEntry.index;

    for (let i = currentIdx - 1; i >= 0; i--) {
      const url = entries[i].url;
      const path = url.split('?')[0];

      if (path !== currPath) {
        navigate(entries[i].index - currentIdx);
        return;
      }
    }
  }

  navigate(fallBack);
}

export function goToRoute(navigate, url) {
  const navigation = selectNavigation();

  if (navigation.canGoBack) {
    const entries = navigation.entries();
    const len = entries.length - 1;
    const encodedUrl = encodeURI(url);

    for (let i = len - 1; i >= 0; i--) {
      const currentUrl = entries[i].url;
      const path = currentUrl.split('?')[0];

      if (path.endsWith('/') && !encodedUrl.endsWith('/')) {
        path.slice(0, -1);
      }

      if (path.endsWith(encodedUrl)) {
        if (!navigate) return currentUrl;

        navigate(currentUrl.replace(window.location.origin, ''));
        return;
      }
    }
  }

  if (!navigate) return url;

  navigate(url);
}
