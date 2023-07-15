export async function setSessionLogger() {
  const { REACT_APP_LOG_ROCKET_ID } = process.env;

  if (REACT_APP_LOG_ROCKET_ID) {
    const { default: LogRocket } = await import('logrocket');
    LogRocket.init(REACT_APP_LOG_ROCKET_ID);
  }
}
