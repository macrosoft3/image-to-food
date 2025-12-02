(function () {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we"re currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startUp() function.

  var video = null;
  var input = null;
  var canvas = null;
  var photo = null;
  var name = null;
  var recipe = null;
  var fileButton = null;
  var startButton = null;

  function startUp() {
    video = document.getElementById("video");
    input = document.getElementById("input");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    name = document.getElementById("name");
    recipe = document.getElementById("recipe");
    fileButton = document.getElementById("button-file");
    startButton = document.getElementById("button-start");

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });

    video.addEventListener("canplay", function (ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        // Firefox currently has a bug where the height can"t be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    }, false);

    fileButton.addEventListener(
      "click",
      (e) => {
        if (input) {
          input.click();
        }
        e.preventDefault(); // "#" への移動を防ぐ
      },
      false,
    );

    startButton.addEventListener("click", function (ev) {
      takePicture();
      ev.preventDefault();
    }, false);

    input.addEventListener("change", handleFile, false);

    clearPhoto();
  }

  function contextDrawImage(image) {
    var context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);

      photoSetAttribute();

      canvasToBlob();
    } else {
      clearPhoto();
    }
  }

  function photoSetAttribute() {
    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  function canvasToBlob() {
    canvas.toBlob(
      async (blob) => {
        const formData = new FormData();
        formData.append("user-pic", blob);

        var data = await sendData(formData);
        photo.setAttribute("src", data.URI);
        elementTextContent(name, data.recipe.recipe_name);
        elementTextContent(recipe, data.recipe.instructions);
      },
      "image/png"
    );
  }

  function elementTextContent(element, data) {
    if (typeof data === "string") {
      element.textContent = data;
    }

    if (Array.isArray(data)) {
      data.forEach((datum) => {
        const li = document.createElement("li");
        li.setAttribute("class", "list-group-item");
        li.textContent = datum;
        element.appendChild(li);
      });
    }
  }

  function handleFile() {
    if (!this.files.length) {
      console.log("ファイルが選択されていません。");
    } else {
      const image = new Image();
      const file = this.files[0];

      image.onload = () => {
        contextDrawImage(image);
      };

      image.src = URL.createObjectURL(file);
    }
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearPhoto() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takePicture() {
    contextDrawImage(video);
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  async function sendData(formdata, endpoint = "post/") {
    try {
      const csrftoken = getCookie("csrftoken");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        mode: "same-origin", // Do not send CSRF token to another domain.
        // FormData インスタンスをリクエスト本体として設定
        body: formdata,
      });
      if (!response.ok) {
        throw new Error(`レスポンスステータス: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener("load", startUp, false);
})();
