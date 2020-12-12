'use strict';


var gCanvas;
var gCtx;
var gLine = 0;




function init() {
    renderMemes()
    gCanvas = document.getElementById("myCanvas");
    gCtx = gCanvas.getContext("2d");
}

function renderMemes() {
    document.querySelector('.grid-container').style.display = "grid";
    document.querySelector('.canvas').style.display = 'none'
    document.querySelector('.editor').style.display = 'none'
    var elGrid = document.querySelector('.grid-container');
    var strHtmls = '';
    var memes = getImgs()

    memes.map((meme) => {
        strHtmls += `<div class="images">
                        <img 
                        class="img-grid" 
                        onclick="renderEditor('${meme.id}')" 
                        src="${meme.url}" 
                        >
                        </div>`
    })
    elGrid.innerHTML = strHtmls;

}

function getImgs() {
    return getImages();
}

function onGallery() {
    document.querySelector('main').classList.add('bgc')
    var elGrid = document.querySelector('.grid-container')
    var elEditor = document.querySelector('.editor-container')
    elGrid.style.display = 'grid';
    elEditor.style.display = 'flex';
    var meme = getMeme();
    meme.lines[0].txt = '';
    meme.lines[0].size = 40;
    meme.lines[1].txt = '';
    meme.lines[1].size = 40;
    renderMemes()
}

function renderEditor(id) {
    document.querySelector('main').classList.remove('bgc')
    document.querySelector('.canvas').style.display = 'block'
    var elGrid = document.querySelector('.grid-container');
    elGrid.style.display = "none";
    var img = new Image();
    img.src = `./img/${id}.jpg`;
    gCtx.drawImage(img, 0, 0);
    renderEditTools(id)

}


function renderEditTools(id) {
    var meme = getMeme();
    var editor = document.querySelector('.editor')
    editor.style.display = 'flex';
    var strHtmls = `<input
    class="input-meme"
    type="text"
    placeholder="Write your meme here"
    name="canvasText"
  />
  <div class="controls-conatainer">
  <label class="label-lines">${(gLine === 0) ? 'Line-Top' : 'Line-Bottom'}</label>
  <div class="font-size"><label >F-size:${meme.lines[gLine].size}px</label></div>
  <div class="controls">
  <button class="delete-btn" onclick="onClear('${id}')"><img src="./icons/delete.png"></button>
  <button class="add-btn" onclick="onAdd('${id}')"><img src="./icons/add.png"></button>
  <button class="edit-btn" onclick="editText('${id}')"><img src="./icons/edit.png"></button>
  </div>
  <div class="lines-text-editor">
  <div class="lines">
  <button class="moveLines" onclick="onLine('${id}')"><img src="./icons/lines.png"></button>
  <button class="line-down" onclick="onMoveLine(${id},-10)"><img src="./icons/arrow-up.png"></button>
  <button class="line-up" onclick="onMoveLine(${id},10)"><img src="./icons/arrow-down.png"></button>
  </div>
  <div class="textEditor">
    <button class="fontPlus" onclick="onChangeFont(${id},'plus')"><img src="./icons/font+.png"></button>
    <button class="fontMinus" onclick="onChangeFont(${id},'minus')"><img src="./icons/font-.png"></button>
    
    <input type="color" name="color" onchange="changeColor('${id}')"/>
  </div>
  </div>
  <div class="actions">
  <button class="btn-download">
  <a href="#" class="link-download" onclick="downloadImg(this)" download="my-img.jpg"><img src="./icons/download.png" />
  Download
  </a></button>
  <form action="" method="POST" enctype="multipart/form-data" onsubmit="uploadImg(this, event)">
  <input name="img" id="imgData" type="hidden" />
  <button class="button share-btn" type="submit"><img src="./icons/share.png" />Share</button>
</form>
<button class="save-btn" onclick="onSave()"><img src="./icons/save.png" />Save Meme</button>
</div></div>`
    editor.innerHTML = strHtmls
}

function onMoveLine(id, diff) {
    var meme = getMeme();
    drawImageAgain(id)
    meme.lines[gLine].position.y += diff
    updateMeme(meme);
    drawText()
}


function changeColor(id) {
    var elInp = document.querySelector('input[name=color]')
    updateColor(id, elInp.value);
    drawImageAgain(id)
    drawText();
    return elInp.value;
}

function editText(id) {
    var elInp = document.querySelector('input[name=canvasText]');
    _switchLine()
    var meme = getMeme();
    var txt = meme.lines[gLine].txt;
    elInp.value = txt;
}
function _switchLine() {
    if (gLine === 0) {
        gLine = 1;
        return;
    }
    else {
        gLine = 0
        return;
    }
}

function onLine(id) {
    if (gLine === 0) {
        gLine = 1;
        renderEditTools(id)
        return;
    }
    else {
        gLine = 0
        renderEditTools(id)
        return;
    }
}

function onAdd(id) {
    var elInp = document.querySelector('input[name=canvasText]')
    var meme = getMeme();
    if (!elInp.value) return;
    if (meme.lines[gLine].txt) {
        meme.lines[gLine].txt = elInp.value;
        drawImageAgain(id);
        updateText(id, elInp.value);
        drawText();
        elInp.value = '';
        return;
    }
    isDraw(gLine);
    var position = meme.lines[gLine].position
    gCtx.font = `${meme.lines[gLine].size}px ${meme.lines[gLine].font}`;
    gCtx.fillStyle = changeColor(id);
    var text = elInp.value;
    gCtx.fillText(text, position.x, position.y);
    elInp.value = '';
    updateText(id, text)
}


function onClear(id) {
    var img = new Image();
    img.src = `./img/${id}.jpg`;
    gCtx.drawImage(img, 0, 0);
    resetProperties();
    renderEditTools(id);


}
function drawImageAgain(id) {
    var img = new Image();
    img.src = `./img/${id}.jpg`;
    gCtx.drawImage(img, 0, 0);
}

function onChangeFont(id, fontSize) {
    if (fontSize === 'minus') changeFont(id, -1);
    if (fontSize === 'plus') changeFont(id, 1);
    drawImageAgain(id);
    drawText();
    renderEditTools(id);
}



function drawText() {
    var meme = getMeme();
    var memeCurrLine = meme.lines[gLine];
    gCtx.font = `${memeCurrLine.size}px ${memeCurrLine.font}`;
    gCtx.fillStyle = memeCurrLine.color;
    gCtx.fillText(memeCurrLine.txt, memeCurrLine.position.x, memeCurrLine.position.y);
    if (gLine === 0) {
        let memeCurrLine = meme.lines[1]
        gCtx.font = `${memeCurrLine.size}px ${memeCurrLine.font}`;
        gCtx.fillStyle = memeCurrLine.color;
        gCtx.fillText(memeCurrLine.txt, memeCurrLine.position.x, memeCurrLine.position.y);
    }
    else {
        let memeCurrLine = meme.lines[0]
        gCtx.font = `${memeCurrLine.size}px ${memeCurrLine.font}`;
        gCtx.fillStyle = memeCurrLine.color;
        gCtx.fillText(memeCurrLine.txt, memeCurrLine.position.x, memeCurrLine.position.y);
    }
}








