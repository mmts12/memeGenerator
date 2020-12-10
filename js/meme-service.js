'use strict';
// const KEY = 'memes'
const IMG_MEME = 'meme'

var gKeywords =
{
    'happy': 12, 'funny puk': 1
}
var gImgs = [
    {
        id: 1, url: './img/1.jpg', keywords: ['funny']
    },
    {
        id: 2, url: './img/2.jpg', keywords: ['funny']
    },
    {
        id: 3, url: './img/3.jpg', keywords: ['baby']
    },
    {
        id: 4, url: './img/4.jpg', keywords: ['funny']
    },
    {
        id: 5, url: './img/5.jpg', keywords: ['baby']
    },
    {
        id: 6, url: './img/6.jpg', keywords: ['funny']
    },
    {
        id: 7, url: './img/7.jpg', keywords: ['baby']
    },
    {
        id: 8, url: './img/8.jpg', keywords: ['movie']
    },
    {
        id: 9, url: './img/9.jpg', keywords: ['baby']
    },
    {
        id: 10, url: './img/10.jpg', keywords: ['funny']
    },
    {
        id: 11, url: './img/11.jpg', keywords: ['movie']
    },
    {
        id: 12, url: './img/12.jpg', keywords: ['funny']
    },
    {
        id: 13, url: './img/13.jpg', keywords: ['movie']
    },
    {
        id: 14, url: './img/14.jpg', keywords: ['movie']
    },
    {
        id: 15, url: './img/15.jpg', keywords: ['movie']
    },
    {
        id: 16, url: './img/16.jpg', keywords: ['movie']
    },
    {
        id: 17, url: './img/17.jpg', keywords: ['funny']
    },
    {
        id: 18, url: './img/18.jpg', keywords: ['movie']
    }
];



var gMeme = {
    selectedImgId: 5,
    // selectedLineIdx: 0,
    lines: [
        {
            isDraw: false,
            txt: '',
            size: 40,
            align: 'center',
            color: 'red',
            font: 'impact'
        },
        {
            isDraw: false,
            txt: '',
            size: 40,
            align: 'center',
            color: 'red',
            font: 'impact'
        }
    ]
}


function getMeme() {
    return gMeme;
}

function getImages() {
    return gImgs;
}
// function isDrawMeme() {
//     if (gMeme.lines[0].isDraw && gMeme.lines[1].isDraw) return 'up-down'
//     if (gMeme.lines[0].isDraw) return 'up';
//     if (gMeme.lines[1].isDraw) return 'down';

// }

function isDraw(gLine) {
    gMeme.lines[gLine].isDraw = true
}

function updateText(id, txt) {
    gMeme.selectedImgId = id;
    gMeme.lines[gLine].txt = txt;
}

function updateColor(id, color) {
    gMeme.selectedImgId = id;
    gMeme.lines[gLine].color = color;
}
function updateFont(id, size) {
    gMeme.selectedImgId = id;
    gMeme.lines[gLine].size = size;
}
function changeFont(id, num) {
    gMeme.selectedImgId = id;
    gMeme.lines[gLine].size += num;
}

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.publish-btn').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}












