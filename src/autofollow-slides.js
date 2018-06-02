console.info('AutoFollow Slides');

class Dom {
  get iconElements() {
    return [
      ...document.querySelectorAll(
        'div.docs-presence-plus-collab-widget-focus'
      ),
    ];
  }

  getIconElementById(id) {
    return document.getElementById(id);
  }

  selectPerson(id) {
    const element = this.getIconElementById(id);
    if (element) {
      element.style.backgroundClip = 'padding-box';
      element.style.boxSizing = 'border-box';
      element.style.border = '3px solid #ff2800';
      element.style.margin = '-3px';
      element.style.animation =
        'autofollow-slides-blink 2.0s ease-in infinite alternate';
    }
  }

  unSelectPerson(id) {
    const element = this.getIconElementById(id);
    if (element) {
      element.style.border = '';
      element.style.margin = '';
      element.style.animation = '';
    }
  }
}

class Autofollow {
  constructor() {
    this.followIntervalID = null;
    this.currentFollowId = null;
    this.dom = new Dom();
    this.addClickFollowEvent();
  }

  addClickFollowEvent() {
    setInterval(this.setClickToFollow.bind(this), 2000);
  }
  setClickToFollow() {
    this.dom.iconElements.forEach(element => {
      if (element.getAttribute('autofollow-slides')) {
        return;
      }
      element.setAttribute('autofollow-slides', true);
      element.addEventListener('click', e => {
        if (!e.isTrusted) {
          // When auto click event
          return false;
        }

        if (this.currentFollowId === element.getAttribute('id')) {
          this.stopFollowPerson();
          return;
        }
        this.startFollowPerson(element);
      });
    });
  }

  startFollowPerson(element) {
    this.followIntervalID = setInterval(() => {
      if (!this.dom.getIconElementById(this.currentFollowId)) {
        // When the target person closes the tab
        this.stopFollowPerson();
        return;
      }
      element.click();
    }, 1000);

    this.currentFollowId = element.getAttribute('id');
    this.dom.selectPerson(this.currentFollowId);
  }

  stopFollowPerson() {
    if (!this.followIntervalID) {
      return;
    }

    clearInterval(this.followIntervalID);
    this.dom.unSelectPerson(this.currentFollowId);
    this.followIntervalID = null;
    this.currentFollowId = null;
  }
}

new Autofollow();
