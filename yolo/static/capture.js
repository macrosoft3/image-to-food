(function () {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var input = null;
  var canvas = null;
  var photo = null;
  var name = null;
  var recipe = null;
  var filebutton = null;
  var startbutton = null;

  function startup() {
    video = document.getElementById('video');
    input = document.getElementById('input');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    name = document.getElementById('name');
    recipe = document.getElementById('recipe');
    filebutton = document.getElementById('filebutton');
    startbutton = document.getElementById('startbutton');

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });

    video.addEventListener('canplay', function (ev) {
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width);

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    filebutton.addEventListener(
      "click",
      (e) => {
        if (input) {
          input.click();
        }
        e.preventDefault(); // "#" への移動を防ぐ
      },
      false,
    );

    startbutton.addEventListener('click', function (ev) {
      takepicture();
      ev.preventDefault();
    }, false);

    input.addEventListener("change", handleFiles, false);

    clearphoto();
  }

  function handleFiles() {
    if (!this.files.length) {
      console.log("ファイルが選択されていません。");
    } else {
      const image = new Image();
      const file = this.files[0];

      image.onload = () => {
        var context = canvas.getContext('2d');
        if (width && height) {
          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0, width, height);

          var data = canvas.toDataURL('image/png');
          photo.setAttribute('src', data);

          canvas.toBlob(
            async (blob) => {
              const formData = new FormData();
              formData.append("user-pic", blob);

              var data = await sendData(formData);
              photo.setAttribute('src', data.URI);
              name.textContent = data.recipe.recipe_name;
              recipe.textContent = data.recipe.instructions;
            },
            'image/png'
          );
        } else {
          clearphoto();
        }
      };

      image.src = URL.createObjectURL(file);
    }
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);

      canvas.toBlob(
        async (blob) => {
          const formData = new FormData();
          formData.append("user-pic", blob);

          var data = await sendData(formData);
          photo.setAttribute('src', data.URI);
          name.textContent = data.recipe.recipe_name;
          recipe.textContent = data.recipe.instructions;
        },
        'image/png'
      );
    } else {
      clearphoto();
    }
  }

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  async function sendData(formdata, endpoint = "post/") {
    try {
      const csrftoken = getCookie('csrftoken');
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 'X-CSRFToken': csrftoken },
        mode: 'same-origin', // Do not send CSRF token to another domain.
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
  window.addEventListener('load', startup, false);
})();
