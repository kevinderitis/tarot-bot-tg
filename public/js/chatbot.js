async function sendMessage(message) {
  const url = '/gpt/assistant';
  const data = {
    prompt: message
  };

  const messageInput = document.getElementById('chat-input');
  messageInput.placeholder = "Escribiendo...";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    console.log(responseData);
    messageInput.placeholder = "Escribe tu mensaje...";

    return responseData;
  } catch (error) {
    console.error('Error:', error);
  }
}

function validateEmail(txt) {
  var patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (patron.test(txt)) {
    console.log('Email validado, se va a enviar otro request')
    setTimeout(async function () {
      let response = await sendMessage(txt);
      generate_message(response.message, 'user');
    }, 10000);
  }
}


$(function () {
  var INDEX = 0;

  function sendInitialMessage() {
    const initialMessage = "¡Hola! ¿En qué puedo ayudarte?";
    generate_message(initialMessage, 'user');
  }

  sendInitialMessage();

  $("#chat-submit").click(async function (e) {
    e.preventDefault();
    var msg = $("#chat-input").val();
    if (msg.trim() == '') {
      return false;
    }
    generate_message(msg, 'self');
    validateEmail(msg);
    var buttons = [
      {
        name: 'Existing User',
        value: 'existing'
      },
      {
        name: 'New User',
        value: 'new'
      }
    ];
    let response = await sendMessage(msg);
    generate_message(response.message, 'user');

  })

  function generate_message(msg, type) {
    INDEX++;
    var str = "";
    str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
    str += "          <span class=\"msg-avatar\">";
    str += "            <img src=\"https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png\">";
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);
    $("#cm-msg-" + INDEX).hide().fadeIn(300);
    if (type == 'self') {
      $("#chat-input").val('');
    }
    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
  }

  function generate_button_message(msg, buttons) {
    /* Buttons should be object array 
      [
        {
          name: 'Existing User',
          value: 'existing'
        },
        {
          name: 'New User',
          value: 'new'
        }
      ]
    */
    INDEX++;
    var btn_obj = buttons.map(function (button) {
      return "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\"" + button.value + "\">" + button.name + "<\/a><\/li>";
    }).join('');
    var str = "";
    str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg user\">";
    str += "          <span class=\"msg-avatar\">";
    str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
    str += "          <\/span>";
    str += "          <div class=\"cm-msg-text\">";
    str += msg;
    str += "          <\/div>";
    str += "          <div class=\"cm-msg-button\">";
    str += "            <ul>";
    str += btn_obj;
    str += "            <\/ul>";
    str += "          <\/div>";
    str += "        <\/div>";
    $(".chat-logs").append(str);
    $("#cm-msg-" + INDEX).hide().fadeIn(300);
    $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    $("#chat-input").attr("disabled", true);
  }

  $(document).delegate(".chat-btn", "click", function () {
    var value = $(this).attr("chat-value");
    var name = $(this).html();
    $("#chat-input").attr("disabled", false);
    generate_message(name, 'self');
  })

  // $("#chat-circle").click(function() {    
  //   $("#chat-circle").toggle('scale');
  //   $(".chat-box").toggle('scale');
  // })
  $("#chat-circle, #btn1-bot").click(function (event) {
    event.preventDefault();
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  });

  $("#btn-mas-info").click(function (event) {
    event.preventDefault();
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
    $("#chat-input").val("Quisiera saber mas sobre Koderix");
  });


  $(".chat-box-toggle").click(function () {
    $("#chat-circle").toggle('scale');
    $(".chat-box").toggle('scale');
  })

})