'use-strict';

var gCount;
var gCounter;

function onSave() {
    saveMemeToLocal()
}

function renderSaveMems() {
    var memesNumber = countMemesCount()
    if (memesNumber === 0) { return };
    var strHtml = '';
    var elGrid = document.querySelector('.grid-container')
    var elEditor = document.querySelector('.editor-container')
    elGrid.style.display = 'block'
    elEditor.style.display = 'none'
    for (i = 0; i < memesNumber; i++) {
        strHtml += `<canvas id="myCanvas${i + 1}" width="500" height="500"></canvas>`;
        elGrid.innerHTML = strHtml;
    }
    for (i = 0; i < memesNumber; i++) {
        var canvas2 = document.getElementById('myCanvas' + (i + 1));
        var ctx2 = canvas2.getContext("2d");
        var img = localStorage.getItem(`meme${i + 1}`);
        drawDataURIOnCanvas(img, ctx2);
    }
}

function saveMemeToLocal() {
    var memesNumber = countMemesCount() + 1
    var url = gCanvas.toDataURL();
    localStorage.setItem('meme' + memesNumber++, url);
    gCount++;
}

function drawDataURIOnCanvas(strDataURI, context) {
    "use strict";
    var img = new window.Image();
    img.addEventListener("load", function () {
        context.drawImage(img, 0, 0);
    });
    img.setAttribute("src", strDataURI);
}

function countMemesCount() {
    var meme = 1;
    counter = 0;
    while (localStorage.getItem(`meme${meme}`)) {
        counter++;
        meme++;
    }
    return counter;
}