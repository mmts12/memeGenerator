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
        strHtmls += `<div class="images"><img class="img-grid" onclick="renderEditor('${meme.id}')" src="${meme.url}" ></div>`
    })
    elGrid.innerHTML = strHtmls;

}

function getImgs() {
    return getImages();
}

function onGallery() {
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
    type="text"
    placeholder="Write your meme here"
    name="canvasText"
  />
  <div class="controls">
  <button class="delete" onclick="onClear('${id}')">Clear All</button>
  <button class="add" onclick="onAdd('${id}')">+</button>
  <button class="moveLines" onclick="onLine('${id}')">Switch Line</button>
  <label>${(gLine === 0) ? 'up' : 'down'}</label>
  </div>
  <div class="textEditor">
    <button class="fontPlus" onclick="onChangeFont(${id},'plus')">Font +</button>
    <button class="fontMinus" onclick="onChangeFont(${id},'minus')">Font -</button>
    <label>${meme.lines[gLine].size}</label>
    <input type="color" name="color" onchange="changeColor('${id}')"/>
  </div>
  <div class="actions">
  <button><a href="#" class="btn-download" onclick="downloadImg(this)" download="my-img.jpg">Download
  </a></button>
  <form action="" method="POST" enctype="multipart/form-data" onsubmit="uploadImg(this, event)">
  <input name="img" id="imgData" type="hidden" />
  <button class="button publish-btn" type="submit">Publish</button>
</form>
<button onclick="onSave()">Save Meme</button>
</div>`
    editor.innerHTML = strHtmls
}

function changeColor(id) {
    var elInp = document.querySelector('input[name=color]')
    updateColor(id, elInp.value);
    drawImageAgain(id)
    drawText();
    return elInp.value;
}

function onLine(id) {
    // var position = chekLine()
    // var lines = checkLines()
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

// function checkLines() {
//     if (gMeme.lines[0].isDraw && gMeme.lines[1].isDraw) return 'up-down'
//     if (gMeme.lines[0].isDraw && !gMeme.lines[1].isDraw) return 'up'
//     if (!gMeme.lines[0].isDraw && gMeme.lines[1].isDraw) return 'down'
// }


// function addFocus(position) {
//     console.log(position)
//     var meme = getMeme();
//     gCtx.strokeStyle = "white";
//     gCtx.strokeRect(position.x - 10, position.y - 50, gCtx.measureText(meme.lines[gLine].txt).width + 20, 70);
// }


function onAdd(id) {
    var elInp = document.querySelector('input[name=canvasText]')
    var meme = getMeme();
    if (meme.lines[gLine].txt) {
        elInp.value = '';
        console.log(meme.lines[gLine].txt);
        return;
    }
    isDraw(gLine);
    var position = chekLine()
    var text = elInp.value;
    gCtx.font = `${meme.lines[gLine].size}px ${meme.lines[gLine].font}`;
    gCtx.fillStyle = changeColor(id);
    gCtx.fillText(text, position.x, position.y);
    elInp.value = '';
    updateText(id, text)


}

function onClear(id) {
    var meme = getMeme();
    var img = new Image();
    img.src = `./img/${id}.jpg`;
    gCtx.drawImage(img, 0, 0);
    meme.lines[0].txt = '';
    meme.lines[0].size = 40;
    meme.lines[1].txt = '';
    meme.lines[1].size = 40;
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
    var position = chekLine()
    var meme = getMeme();
    gCtx.font = `${meme.lines[gLine].size}px ${meme.lines[gLine].font}`;
    gCtx.fillStyle = meme.lines[gLine].color;
    gCtx.fillText(meme.lines[gLine].txt, position.x, position.y);
    if (gLine === 0) {
        gCtx.font = `${meme.lines[1].size}px ${meme.lines[1].font}`;
        gCtx.fillStyle = meme.lines[1].color;
        gCtx.fillText(meme.lines[1].txt, 50, 470);
    }

    else {
        gCtx.font = `${meme.lines[0].size}px ${meme.lines[0].font}`;
        gCtx.fillStyle = meme.lines[0].color;
        gCtx.fillText(meme.lines[0].txt, 50, 70);
    }

}

function chekLine() {
    if (gLine === 0) return { x: 50, y: 70 }
    return { x: 50, y: 470 }
}




