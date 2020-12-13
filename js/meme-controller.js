'use strict';


var gCanvas;
var gCtx;
var gLine = 0;
var gIsPaint = false



function init() {

    renderMemes()
    renderKeywords()
    gCanvas = document.getElementById("myCanvas");
    gCtx = gCanvas.getContext("2d");
    gCanvas.addEventListener('mousedown', startDraw)
    gCanvas.addEventListener('mousemove', draw)
    gCanvas.addEventListener('mouseup', stopDraw)
}

function startDraw() {
    gIsPaint = true;
}

function stopDraw() {
    gIsPaint = false;
}

function draw(ev) {
    if (!gIsPaint) return;
    var meme = getMeme();
    const offsetX = ev.offsetX
    const offsetY = ev.offsetY
    const posY = meme.lines[gLine].position.y
    const posX = meme.lines[gLine].position.x
    var txt = meme.lines[gLine].txt
    var txtLen = gCtx.measureText(txt).width
    var fontSize = meme.lines[gLine].size;
    console.log('x', offsetX, 'y', offsetY)
    console.log(posX, posY)
    console.log(txtLen)
    if (offsetX > posX - 10 && offsetX < posX + txtLen && offsetY > posY - 20 && offsetY < posY + fontSize - 20) {
        console.log('hiiii')
        meme.lines[gLine].position.x = offsetX - 10
        meme.lines[gLine].position.y = offsetY - 10
    }
    drawImageAgain(meme.selectedImgId);
    updateMeme(meme);
    drawText()
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
    var keyWords = getKeywords()
    console.log(getImages())
    return getImages(keyWords.key);
}

function onGallery() {
    document.querySelector('main').classList.add('bgc')
    var elGrid = document.querySelector('.grid-container')
    var elEditor = document.querySelector('.editor-container')
    var elKeyWords = document.querySelector('.keywords')
    elKeyWords.style.display = 'flex'
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
    var elKeyWords = document.querySelector('.keywords')
    elKeyWords.style.display = 'none'
    elGrid.style.display = "none";
    var meme = getMeme();
    meme.selectedImgId = id;
    var img = new Image();
    img.src = `./img/${id}.jpg`;
    gCtx.drawImage(img, 0, 0);
    updateMeme(meme);
    renderEditTools(id)

}


function renderEditTools(id) {
    var editor = document.querySelector('.editor')
    editor.style.display = 'flex';
    var strHtmls = `<input
    class="input-meme"
    type="text"
    oninput="onDrawInput(this,'${id}')"
    placeholder="Write your meme here"
    name="canvasText"
  />
  <div class="controls-conatainer">
  
  <div class="controls">
  <button class="edit-btn" onclick="editText('${id}')"><i class="far fa-edit"></i></button>
  <button class="add-btn" onclick="onAdd('${id}')"><i class="fas fa-plus"></i></button>
  <button class="delete-btn" onclick="onClear('${id}')"><i class="fas fa-trash"></i></button>
  </div>
  <div class="lines-text-editor">
  <button class="line-down" onclick="onMoveLine(${id},-10)"><i class="fas fa-long-arrow-alt-up"></i></button>
  <button class="line-up" onclick="onMoveLine(${id},10)"><i class="fas fa-long-arrow-alt-down"></i></button>
  <button class="fontPlus" onclick="onChangeFont(${id},'plus')"><img src="./icons/font+.png"></button>
  <button class="fontMinus" onclick="onChangeFont(${id},'minus')"><img src="./icons/font-.png"></button>
  <div class="input-color-icon"> 
  <input class="input-color"  type="color" name="color" onchange="changeColor('${id}')"/>
  <button class="color-btn"><i class="fas fa-palette"></i></button>
  
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
    renderColor()
}



function onDrawInput(elInp, id) {
    var meme = getMeme();
    let txt = elInp.value
    console.log(txt);
    meme.lines[gLine].txt = txt
    updateMeme(meme);
    drawImageAgain(id);
    drawText();
}

function onMoveLine(id, diff) {
    var meme = getMeme();
    drawImageAgain(id);
    meme.lines[gLine].position.y += diff
    updateMeme(meme);
    drawText();
}


function changeColor(id) {
    var elInp = document.querySelector('input[name=color]')
    updateColor(id, elInp.value);
    drawImageAgain(id)
    drawText();
}

function editText(id) {
    onLine(id)
    var elInp = document.querySelector('input[name=canvasText]');
    var meme = getMeme();
    var txt = meme.lines[gLine].txt;
    elInp.value = txt;
}

function renderColor() {
    var meme = getMeme();
    var elInp = document.querySelector('input[name=color]');
    elInp.value = meme.lines[gLine].color;
}


function onLine(id) {
    console.log(gLine);
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
    isDraw(gLine);
    var position = meme.lines[gLine].position
    gCtx.font = `${meme.lines[gLine].size}px ${meme.lines[gLine].font}`;
    gCtx.fillStyle = meme.lines[gLine].color;
    var text = elInp.value;
    gCtx.fillText(text, position.x, position.y);
    elInp.value = '';
    updateText(id, text)
    onLine(id)
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
}



function drawText() {
    // console.log('draw')
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

function renderKeywords() {
    var keyWords = document.querySelector('.keywords');
    var strHtmls = `<div onclick="onKeyWord(this,'funny')" class="funny-key">funny</div>
    <div onclick="onKeyWord(this,'movie')" class="movie-key">movie</div>
    <div onclick="onKeyWord(this,'baby')" class="baby-key">baby</div>
    <div onclick="onKeyWord(this,'all')" class="all-key">\u00A0 All</div>`
    keyWords.innerHTML = strHtmls;
}

function onKeyWord(word, key) {
    changeKeyWord(key);
    var keyWords = getKeywords();
    var size = keyWords[key];
    keyWords[key] += 0.3
    word.style.fontSize = size + 'rem';
    updateKeyWords(keyWords);
    renderMemes()
}





