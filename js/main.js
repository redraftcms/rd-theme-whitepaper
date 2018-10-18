window.addEventListener("load", () => {

  if (!window.fullyLoaded) {
    (function() {
      window.fullyLoaded = true;
      console.log("X ONLOAD");
      document.addEventListener("click", (e) => {
        let t = e.target;
        if (t.tagName==="A" && !t.href.hostname) {
          e.preventDefault();
          e.stopPropagation();
          dennis.loadPage(t.href)
          .then((response) => {
            console.log("Location changed to", t.href);
          })
          .catch((error) => {
            console.error(error);
          })
        }
        else {
          return true;
        }
      });
      window.onpopstate = function(e) {
        if (e && e.state && e.state.url) {
          dennis.loadPage(e.state.url, e.state)
        }
      };
    })()
  }

  let dennis = {
    getPreference: (preference) => {
      try {
        return localStorage.getItem(preference)
      }
      catch(error) {
        console.error(error)
        return false
      }
    },
    setPreference: (preference, value) {
      try {
        return localStorage.setItem(preference, value)
      }
      catch (error) {
        console.error(error)
        return false
      }
    },
    loadPage: (url, state) => {
      console.log("X LOADPAGE");
      if (!url) return;
      return this.ajax("GET", url)
      .then(response => {
        var theme = this.getPreference("theme") || "light";
        if (theme==="dark") {
          response = response.replace("/undark.css","/dark.css");
        }
        var html = document.querySelector("html");
        html.innerHTML = response;
        var title = document.querySelector("title");
        var titleUpdate = html.querySelector("title");
        title.innerHTML = titleUpdate.innerHTML;
        var bodyUpdate = html.querySelector("body");
        var body = document.body.innerHTML = bodyUpdate.innerHTML;
        var event = document.createEvent("Event");
        event.initEvent("load");
        window.dispatchEvent(event);
      })
      .catch(err => Promise.reject(err))
    },
    ajax: (method, url) => {
      console.log("X AJAX");
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
