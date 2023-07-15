import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import type { NavigationType } from 'react-router-dom';

const SESSION_KEY = 'navigationHistory';

class NavigationHistoryEntry {
  index: number;
  url: string;

  constructor(index: number, url: string) {
    this.index = index;
    this.url = url;
  }

  public updateUrl(url: string) {
    this.url = url;
  }

  public updateIndex(index: number) {
    this.index = index;
  }
}

const navigationStack: NavigationHistoryEntry[] = [];

class Navigation {
  canGoBack: Boolean;
  currentEntry: NavigationHistoryEntry;

  constructor(canGoBack: Boolean, currentEntry: NavigationHistoryEntry) {
    this.canGoBack = canGoBack;
    this.currentEntry = currentEntry;
  }

  public setNavigation(entry: NavigationHistoryEntry, canGoBack: Boolean) {
    this.currentEntry = entry;
    this.canGoBack = canGoBack;
  }

  public entries() {
    return navigationStack;
  }

  public static initialize() {
    let canGoBack = false,
      currentIndex = 0,
      currentUrl = window.location.href;

    const sessionNavigationHistory = sessionStorage.getItem(SESSION_KEY);

    if (sessionNavigationHistory) {
      navigationStack.push(
        ...JSON.parse(sessionNavigationHistory).map(
          ({ index, url }: NavigationHistoryEntry) =>
            new NavigationHistoryEntry(index, url)
        )
      );

      const current = navigationStack.find(d => d.url === currentUrl)!;

      if (current) {
        canGoBack = current.index > 0;
        currentIndex = current.index;
        currentUrl = current.url;
      }
    }

    return new Navigation(
      canGoBack,
      new NavigationHistoryEntry(currentIndex, currentUrl)
    );
  }
}

export const navigation = Navigation.initialize();

let lastPopIndex: number | undefined;

function setNavigationStackEntries(
  location: Location,
  navigationType: NavigationType
) {
  switch (navigationType) {
    case 'REPLACE':
      if (navigationStack.length > 0) {
        for (let i = navigationStack.length - 1; i >= 0; i--) {
          const currentPath = navigationStack[i].url
            .split('?')[0]
            .replace(location.origin, '');

          if (currentPath === location.pathname) {
            navigationStack[i].updateUrl(location.href);
            break;
          }
        }
      }
      break;

    case 'PUSH':
      if (lastPopIndex) {
        navigationStack.slice(lastPopIndex + 1);
        navigationStack.push(
          new NavigationHistoryEntry(navigationStack.length, location.href)
        );
        lastPopIndex = undefined;
      } else if (
        navigationStack[navigationStack.length - 1].url !== location.href
      ) {
        navigationStack.push(
          new NavigationHistoryEntry(navigationStack.length, location.href)
        );
      }
      break;

    case 'POP':
      if (!navigationStack.length) {
        navigationStack.push(
          new NavigationHistoryEntry(navigationStack.length, location.href)
        );
      } else {
        for (let i = navigationStack.length - 1; i >= 0; i--) {
          const currentPath = navigationStack[i].url
            .split('?')[0]
            .replace(location.origin, '');

          if (currentPath === location.pathname) {
            lastPopIndex = navigationStack[i].index;
            break;
          }
        }
      }
      break;

    default:
      break;
  }

  navigation.setNavigation(
    navigationStack.find(d => d.url === location.href)!,
    navigationStack.length > 1
  );

  if (navigationStack.length > 50) {
    navigationStack.shift();
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(navigationStack));
}

const CreateNavigationContext = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    console.warn(
      `Your browser don't have support for the latest Navigation API. Defaulting to a custom polyfill.`
    );
  }, []);

  useEffect(() => {
    setNavigationStackEntries(window.location, navigationType);
  }, [location]);

  return null;
};

export default CreateNavigationContext;
