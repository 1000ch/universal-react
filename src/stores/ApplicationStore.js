import BaseStore from 'fluxible/addons/BaseStore';

class ApplicationStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this.pageTitle = '';
  }

  handlePageTitle(currentRoute) {
    if (currentRoute.title) {
      this.pageTitle = currentRoute.title;
      this.emitChange();
    }
  }

  getState() {
    return {
      pageTitle: this.pageTitle
    };
  }

  dehydrate() {
    return {
      pageTitle: this.pageTitle
    };
  }

  rehydrate(state) {
    this.pageTitle = state.pageTitle;
  }
}

ApplicationStore.storeName = 'ApplicationStore';
ApplicationStore.handlers = {
  NAVIGATE_SUCCESS: 'handlePageTitle'
};

export default ApplicationStore;