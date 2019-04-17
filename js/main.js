window.addEventListener("load", () => {
  const entryUrl = window.location.href;
  const entryTitle = document.title;

  if (!window.history.state) {
    window.history.replaceState({
      title: entryTitle,
      url: entryUrl
    }, entryTitle, entryUrl)
  }

  if (!window.fullyLoaded) {
    (function() {
      window.fullyLoaded = true;
      void 0;
      document.addEventListener("click", (e) => {
        let t = e.target;
        if (t.tagName==="A" && !t.href.hostname) {
          e.preventDefault();
          e.stopPropagation();
          let previous = {
            title: document.title,
            url: t.href
          }
          dennis.loadPage(t.href)
          .then((response) => {
            void 0;
            void 0
          })
          .catch((error) => {
            void 0;
          })
        }
        else {
          return true;
        }
      });
      window.addEventListener("popstate", function(e) {
        void 0
        if (e && e.state && e.state.url) {
          dennis.loadPage(e.state.url, e.state)
        }
      });
      window.addEventListener("keyup", function(e) {
        if (e.key === "Backspace") window.history.back()
      })
    })();
  }

  let dennis = {
    getPreference: (preference) => {
      try {
        return localStorage.getItem(preference)
      }
      catch(error) {
        void 0
        return false
      }
    },
    setPreference: (preference, value) => {
      try {
        return localStorage.setItem(preference, value)
      }
      catch (error) {
        void 0
        return false
      }
    },
    loadPage: (url, state) => {
      void 0;
      if (!url) return;
      return dennis.ajax("GET", url)
      .then(response => {
        var theme = dennis.getPreference("theme") || "light";
        if (theme==="dark") {
          response = response.replace("/undark.css","/dark.css");
        }
        var html = document.createElement("html");
        html.innerHTML = response;
        void 0
        var title = document.querySelector("title");
        var titleUpdate = html.querySelector("title");
        title.innerHTML = titleUpdate.innerHTML;
        var canon = document.querySelector("link[rel=canonical]");
        var canonUpdate = html.querySelector("link[rel=canonical]");
        canon.href = canonUpdate.href;
        var bodyUpdate = html.querySelector("body");
        document.body.innerHTML = bodyUpdate.innerHTML;
        if (!state) {
          state = {
            title: document.title,
            url: url
          }
          history.pushState(state, document.title, url)
        }
        var event = document.createEvent("Event");
        event.initEvent("load");
        window.dispatchEvent(event);
      })
      .catch(err => Promise.reject(err))
    },
    ajax: (method, url) => {
      void 0;
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function() {
          if (this.status!==200) return reject(this.statusText);
          resolve(this.responseText);
        })
        xhr.open("GET", url);
        xhr.send();
      })
    }
  }
})
