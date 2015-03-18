
function addBlock() {
  var blockForm = document.getElementById("block-form");
  createBlock(blockForm.elements['level-number'].value, 
    blockForm.elements['block-name'].value);
  toggleDialog('block-dialog');
}

function saveBlock(e) {
  var blockForm = document.getElementById("block-form");
  var json = new Object();
  json['save'] = 'block';
  json['level'] = blockForm.elements['level-number'].value;
  json['name'] = blockForm.elements['block-name'].value;
  sendJSON(JSON.stringify(json));
  toggleDialog('block-dialog');
}

function addProperty() {
	var propForm = document.getElementById("prop-form");
  var block = propForm.elements['block-name'].value;
  var value = propForm.elements['prop-name'].value;
  createProperty(block,'',value);
  toggleDialog('prop-dialog');
}

function saveProperty(e) {
  var propForm = document.getElementById("prop-form");
  var block = propForm.elements['block-name'].value;
  var name = propForm.elements['prop-name'].value;
  var type = propForm.elements['prop-type'].value;
  var value = propForm.elements['prop-value'].value;
  var json = new Object();
  json['save'] = 'property';
  json['block_name'] = block;
  json['value'] = value;
  json['type'] = type;
  json['name'] = name;
  sendJSON(JSON.stringify(json));
  toggleDialog('prop-dialog');
}

function updateData() {
  var data = document.querySelectorAll("#form-dialog form .content [data='']");
  var json = new Object;
  json = new Array();
  json[0] = new Object();
  json[0]['update'] = '';
  for (var i = 0, j = 1; i < data.length; i++, j++) {
    json[j] = new Object();
    json[j]['id'] = data[i].id;
    json[j]['value'] = data[i].value;
  }
  sendJSON(JSON.stringify(json));
}

function toggleDialog(id) {
  var dialog = document.getElementById(id);
  if (dialog.style.display == 'block') {
    if (id == 'block-dialog') {
      clearBlockDialog();
    }
    if (id == 'prop-dialog') {
      clearPropDialog();
    }
    if (id == 'form-dialog') {
      offContactForm();
    }
    dialog.style.display = 'none';
  }
  else 
    dialog.style.display = 'block';
}

function clearPropDialog() {
  var propForm = document.getElementById("prop-form");
  propForm.elements['block-name'].value = '';
  propForm.elements['prop-name'].value = '';
}

function clearBlockDialog() {
  var blockForm = document.getElementById("block-form");
  blockForm.elements['block-name'].value = '';
}

window.onload = function() {
  sendRequest('blocks','',load);
}

function load(json) {
  var levelOld = -1;
  for (var i = 0; i < json.length; i++) {
    if (levelOld != json[i].level && json[i].level > levelOld) {
      levelOld = json[i].level;
      createLevel(levelOld);
    }
    createBlock(json[i].level, json[i].name);
    var props = json[i].properties;
    for (var j = 0; j < (props != null ? props.length : 0); j++) {
      createProperty(json[i].name, '', props[j].name);
    }
  }
  addListeners();
}

function addListeners() {
  var contacts = document.querySelectorAll(".contact");
  for (var i = 0; i < contacts.length ; i++) {
    contacts[i].addEventListener("click", 
        function (event) {
            event.preventDefault();
            getBlockForm(this.getAttribute('name'));
        }, 
        false);
  }
  var blockToggle = function (event) {
            event.preventDefault();
            toggleDialog('block-dialog');
  };
  var propToggle = function (event) {
            event.preventDefault();
            toggleDialog('prop-dialog');
  };
  document.getElementById('btn-new-block').addEventListener("click", blockToggle, false);
  document.getElementById('btn-close-block').addEventListener("click", blockToggle, false);
  document.getElementById('btn-new-prop').addEventListener("click", propToggle, false);
  document.getElementById('btn-close-prop').addEventListener("click", propToggle, false);

  document.getElementById("btn-save-block").addEventListener('click',
    function (event) {
            event.preventDefault();
            saveBlock(event);
    },
  true);
  document.getElementById("btn-save-property").addEventListener('click',
    function (event) {
            event.preventDefault();
            saveProperty(event);
    },
  true);
}

function sendRequest(request, requestValue, callback) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 ) {
           if(xmlhttp.status == 200) {
              try {
                callback(JSON.parse(xmlhttp.responseText), requestValue);
              } catch (e) {
                callback(null, requestValue);
              }
           }
           else if(xmlhttp.status == 400) {
              alert("Error - 400")
           }
           else {
               alert(xmlhttp.responseText);
           }
        }
    }

    xmlhttp.open("POST", "http://krassula.pp.ua/test/test.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(request + "=" + requestValue);
}

function sendJSON(json) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 ) {
           if(xmlhttp.status == 200) {
              alert(xmlhttp.responseText);
              location.reload();
           }
           else if(xmlhttp.status == 400) {
              alert("Error - 400");
           }
           else {
               alert(xmlhttp.responseText);
           }
        }
    }

    xmlhttp.open("POST", "http://krassula.pp.ua/test/test-save.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(json);
}

function createLevel(num) {
  var body = document.querySelector('.form > div');
  tempLevel = document.createElement("div");
  tempLevel.setAttribute('id','level-' + num);
  body.appendChild(tempLevel);    
}

function createBlock(level, name) {
  var newDiv = document.createElement("div");
  newDiv.className = "contact";
  newDiv.setAttribute("name", name);
  var newLabel = document.createElement("label");
  newLabel.textContent = name;
  var newBr = document.createElement("br");
  newDiv.appendChild(newLabel);
  newDiv.appendChild(newBr);

  // add the newly created element and its content into the DOM 
  document.getElementById("level-" + level).appendChild(newDiv);
}

function createProperty(block,type,value) {
  var block = document.querySelector("[name='" + block +"']");
  var newDiv = document.createElement("div");
  var newSpan = document.createElement("span");
  newSpan.className = "click-and-view";
  var newContent = document.createTextNode(value);
  newSpan.appendChild(newContent);
  newDiv.className = "property";
  newDiv.appendChild(newSpan);
  block.appendChild(newDiv);
}

function getBlockForm(name) {
  sendRequest('block-props-detail', name, showContact);
}

function showContact(json, name) {
  if (json == undefined) {
    alert("Add some properties. Bye Bye. :)");
    return;
  }
  var body = document.querySelector("#form-dialog div.content");
  var header = document.createElement("h1");
  header.textContent = name;
  var newDiv;
  for (var i = 0; i < json.length; i++) {
    newDiv = document.createElement("div");
    newDiv.className = 'form-control';
    newDiv.innerHTML = '<label>' + json[i].name + ':</label> <input id="' + json[i].id + '" type="' 
                          + json[i].type + '" name="' + json[i].name + '" value="' + json[i].value + '" data="">';
    body.appendChild(newDiv);
  }
  toggleDialog('form-dialog');
}

function offContactForm() {
  document.querySelector("#form-dialog div.content").innerHTML = '';
}

function getTextHTML(msg) {
  var inputText = '<input type="text"';
  if (msg != null)
    inputText +=  " placeholder='" + msg + "'>";
  else
    inputText += ">";
  return inputText;
}

function getTextAreaHTML(msg) {
  var inputTextArea = '<input type="textarea"';
  if (msg != null)
    inputTextArea +=  " placeholder='" + msg + "'>";
  else
    inputTextArea += ">";
  return inputTextArea;
}

function getSelectHTML(choices) {
  if (choices == null || choices.length == 0)
    return;
  var selectText = '<select>';
  var el;
  for (var i = 0; i < choices.length; i++) {
    el = choices[i];
    selectText += '<option value="' + el + '">' + el + '</option>';
  }
  selectText += '</select>';
  return selectText;
}