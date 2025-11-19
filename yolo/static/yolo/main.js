const config = {
  constraints: {
    audio: false,
    video: { width: 1280, height: 720 },
  },
  delay: 10000,
  url: "/yolo/camera/",
};

const elements = {
  alert: null,
  detect: null,
  load: null,
  place: null,
  result: null,
  video: null,
};

const ui = {
  showButton(disabled) {
    elements.detect.disabled = disabled;
  },
  showLoading(visible) {
    elements.load.classList.toggle("d-none", !visible);
  },
  showError(text) {
    elements.alert.textContent = text;
    elements.alert.classList.remove("d-none");
    setTimeout(() => {
      elements.alert.classList.add("d-none");
    }, config.delay);
  },
  showResult(src) {
    if (elements.place) {
      elements.place.classList.add("d-none");
    }

    elements.result.src = src;
    elements.result.classList.remove("d-none");
  }
};

const camera = {
  captureFrame() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = elements.video.videoWidth;
    canvas.height = elements.video.videoHeight;
    ctx.drawImage(elements.video, 0, 0);

    return canvas.toDataURL();
  },
  async getMedia(constraints) {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      throw error;
    }
  }
};

const api = {
  getCSRFToken() {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
  },
  async postData(url, data) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": this.getCSRFToken(),
        },
        body: JSON.stringify({ image: data }),
      });
      if (!response.ok) {
        throw new Error(`レスポンスステータス: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      throw error;
    }
  },
};

const app = {
  addEventListeners() {
    elements.detect.addEventListener("click", () => this.foodDetection());
  },
  getElements() {
    elements.alert = document.getElementById("alert");
    elements.detect = document.getElementById("detect");
    elements.load = document.getElementById("loading");
    elements.place = document.getElementById("placeholder");
    elements.result = document.getElementById("result");
    elements.video = document.getElementById("video");
  },
  async foodDetection() {
    ui.showButton(true);
    ui.showLoading(true);
    try {
      const image = camera.captureFrame();
      const result = await api.postData(config.url, image);
      ui.showResult(result);
    } catch (error) {
      ui.showError(`${error.name}: ${error.message}`);
      console.error(`${error.name}: ${error.message}`);
    } finally {
      ui.showButton(false);
      ui.showLoading(false);
    }
  },
  async initialize() {
    let stream = null;

    try {
      stream = await camera.getMedia(config.constraints);
      this.addEventListeners();
      elements.video.srcObject = stream;
    } catch (error) {
      ui.showError(`${error.name}: ${error.message}`);
      console.error(`${error.name}: ${error.message}`);
      throw error;
    }
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    app.getElements();
    app.initialize();
  });
} else {
  app.getElements();
  app.initialize();
}