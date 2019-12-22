import Dispatcher from './Dispatcher';

if (!window.MyApp) {
  window.MyApp = {};
}

if (!window.MyApp.rootDispatcher) {
  window.MyApp.rootDispatcher = new Dispatcher();
}

export default window.MyApp.rootDispatcher;
