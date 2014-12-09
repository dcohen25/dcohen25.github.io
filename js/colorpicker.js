var myHistory = [];
var currPanel;

//have one listener that gets called and identifies element id/name and does apporpriate task
function addEventListeners(){
    //song listener 
    document.getElementById("container").addEventListener("mousedown", function(e){
        var elementName = (e.target || e.srcElement).className || (e.target || e.srcElement).id;
        switch(elementName){
            case "content-start":   hide(currPanel);
                                    showColorPicker();
                                    break;
            case "top-menu-recent": hide(currPanel);
                                    myHistory.push(currPanel);
                                    showRecentlyPlayed();
                                    break;
            case "top-menu-settings":   hide(currPanel);
                                        myHistory.push(currPanel);
                                        showSettings();
                                        break;
            case "top-menu-back":   hide(currPanel);
                                    show(myHistory.pop());
                                    break;
            case "play":    var song = e.target.parentNode.parentNode;
                            if (song.className === "recent-song"){
                                addToQueue(song.innerHTML);
                            }
                            play();
                            break;
            case "pause":   pause();
                            break;
        }
    }, false);

    var colorPicker = document.getElementById("content-color-picker");
    var isMouseDown = false;

    colorPicker.addEventListener("mousedown", function(e){
        isMouseDown = true;
        process(e);
    }, false);

    colorPicker.addEventListener("mousemove", function(e){
        if (isMouseDown){
            process(e);
        }
    }, false);

    colorPicker.addEventListener("mouseup", function(){
        isMouseDown = false; 
    }, false);
}

function initializeApp(){
    currPanel = document.getElementById("content-start");
    drawCanvas();
    addEventListeners();
}

function process(e){
    var position = getPosition(e);
    var colorData = getColorData(position);
    var hsv = getHSV(colorData[0], colorData[1], colorData[2]);
    var rgb = getRGB(colorData[0], colorData[1], colorData[2]);
    var mood = getMood(hsv[0], hsv[1], hsv[2]);
    var nowPlaying = document.getElementById("now-playing");

    if (!nowPlaying.firstChild || nowPlaying.firstChild.children[4].paused){
        addToQueue(getSong(mood));
    }
    
    updateCursor(position);
    updateTextBox(position, mood, rgb);
}

function getPosition(e) {
    var colorPicker = document.getElementById("content-color-picker");
    var colorPickerRect = colorPicker.getBoundingClientRect();

    var cursorX = (e.pageX - document.body.scrollLeft - colorPickerRect.left)/(colorPickerRect.right - colorPickerRect.left) * colorPicker.offsetWidth;
    var cursorY = (e.pageY - document.body.scrollTop - colorPickerRect.top)/(colorPickerRect.bottom - colorPickerRect.top) * colorPicker.offsetHeight;
    
    if (cursorX < colorPicker.style.left){
        cursorX = colorPicker.style.left;
    }
    if (cursorX > colorPicker.style.left + colorPicker.offsetWidth){
        cursorX = colorPicker.style.left + colorPicker.offsetWidth;
    }
    if (cursorY < colorPicker.style.top){
        cursorY = colorPicker.style.top;
    }
    if (cursorY > colorPicker.style.top + colorPicker.offsetHeight){
        cursorY = colorPicker.style.top + colorPicker.offsetHeight;   
    }
    return [Math.round(cursorX), Math.round(cursorY)];
}

function getColorData(pos){
    var canvas = document.getElementById("canvas-color-picker");
    var ctx = canvas.getContext("2d");
    return ctx.getImageData(pos[0], pos[1], 1, 1).data; 
}

function getRGB(r, g, b){
    return "rgb(" + r + "," + g + "," + b + ")";
}

function getHex(r, g, b){
    function digitToHex(d) {
        var hex = d.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + digitToHex(r) + digitToHex(g) + digitToHex(b);
}

function show(panel){
    switch (panel.id){
        case "content-color-picker" : showColorPicker();
                                        break;
        case "content-recently-played": showRecentlyPlayed();
                                        break;
        case "content-now-playing-expand":
                                        break;

        case "content-settings": showSettings();
                                        break;

        default :
    }
}

function hide(panel){
    switch (panel.id){
        case "content-color-picker" : hideColorPicker();
                                    break;
        case "content-recently-played": hideRecentlyPlayed();
                                      break;
        case "content-now-playing-expand":
                                         break;
        case "content-settings": hideSettings();
                                break;
        case "content-start":   hideStart();
                                break;
        default :
    }
}

function getHSV(arguments1, arguments2, arguments3){
    var rr, gg, bb,
        r = arguments1 / 255,
        g = arguments2 / 255,
        b = arguments3 / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } 
    else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }
        else if (g === v) {
            h = (1 / 3) + rr - bb;
        }
        else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }
        else if (h > 1) {
            h -= 1;
        }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function getMood(h, s, v){
    if (s < 10){
        //Neutral
        return "neutral";
    }
    if (h <= 10 || h >= 350){
        //Red
        return "loving";
    }
    if (10 <= h && h < 40){
        //Orange
        return "happy";
    }
    if (40 <= h && h < 60){
        //yellow
        return "happy";
    }
    if (60 <= h && h < 130){
        //Green
        return "energetic";
    }
    if (130 <= h && h < 210){
        //Light Blue
        return "energetic";
    }
    if (210 <= h && h < 250){
        //Blue
        return "sad";
    }
    if (250 <= h && h < 270){
        //Purple
        return "sad";
    }
    if (270 <= h && h < 350){
        //Pink
        return "loving";
    }
}

function getSong(mood){
    var song = document.getElementById(mood);
    if (song){
        return song.innerHTML;
    }
    return null;
}

function addToQueue(song){
    document.getElementById("now-playing").innerHTML = song;
}

function addToRecents(song){
    var recents = document.getElementById("content-recently-played");
    recents.innerHTML = "<div class=recent-song>" + song + "</div>" + recents.innerHTML;
}

function play(){
    var nowPlaying = document.getElementById("now-playing");

    if (nowPlaying.firstChild.children[4].currentTime === 0){ 
        addToRecents(nowPlaying.innerHTML);
    }

    nowPlaying.firstChild.children[2].style.display = "none";
    nowPlaying.firstChild.children[3].style.display = "block";
    nowPlaying.firstChild.children[4].play();
}

function pause(){
    var nowPlaying = document.getElementById("now-playing");
    nowPlaying.firstChild.children[3].style.display = "none";
    nowPlaying.firstChild.children[2].style.display = "block";
    nowPlaying.firstChild.children[4].pause();
}

function updateCursor(pos){
    var cursor = document.getElementById("content-color-picker-cursor");
    cursor.style.left = pos[0] - cursor.offsetWidth/2 + 'px';
    cursor.style.top = pos[1] - cursor.offsetHeight/2 + 'px';
}

function updateTextBox(pos, mood, color){
    var colorPicker = document.getElementById("content-color-picker");
    var textBox = colorPicker.children[1];
    var boxX = pos[0] - textBox.offsetWidth/2;
    var boxY = pos[1] - (textBox.offsetHeight + 10);

    if (boxX < colorPicker.style.left){
        boxX = pos[0] + 10;
    }
    else if (boxX + textBox.offsetWidth > colorPicker.style.left + colorPicker.offsetWidth){
        boxX = pos[0] - (textBox.offsetWidth + 10); 
    }
    if (boxY < colorPicker.style.top){
        boxY = pos[1] + 10;
    }
    else if (boxY + textBox.offsetHeight > colorPicker.style.top + colorPicker.offsetHeight){
        boxY = pos[1] - (textBox.offsetHeight + 10);
    }
    textBox.style.left = boxX + 'px';
    textBox.style.top = boxY + 'px';
    textBox.style.backgroundColor = color;
    textBox.value = mood;
}

function drawCanvas(){
    var canvas = document.getElementById("canvas-color-picker");
    var main = document.getElementById("main");
    var ctx = canvas.getContext("2d");
    canvas.width = main.offsetWidth;
    canvas.height = main.offsetHeight;
    var image = new Image();
    image.src = '../images/colorwheel.png';
    image.onload = function(){
        ctx.drawImage(image, 0, 0);
    }
}


function hideStart(){
    document.getElementById("content-start").style.display = "none";
}

function showColorPicker(){
    var colorPicker = document.getElementById("content-color-picker");
    colorPicker.style.display = "block";
    document.getElementById("top-menu-recent").style.display = "block";
    document.getElementById("top-menu-settings").style.display = "block";
    currPanel = colorPicker;
}

function hideColorPicker(){
    document.getElementById("content-color-picker").style.display = "none";
    document.getElementById("top-menu-recent").style.display = "none";
}

function showRecentlyPlayed(){
    var recentlyPlayed = document.getElementById("content-recently-played");
    recentlyPlayed.style.display = "block";
    var topMenu = document.getElementById("top-menu").children;
    topMenu[4].style.display = "block";
    topMenu[2].firstChild.innerHTML = "Recently Played";
    topMenu[2].style.display = "block";
    currPanel = recentlyPlayed;

}

function hideRecentlyPlayed(){
    document.getElementById("content-recently-played").style.display = "none";
    var topMenu = document.getElementById("top-menu").children;
    topMenu[4].style.display = "none";
    topMenu[2].style.display = "none";
}

function showSettings(){
    var settings = document.getElementById("content-settings");
    settings.style.display = "block";
    var topMenu = document.getElementById("top-menu").children;
    //hide settings, show back
    topMenu[2].firstChild.innerHTML = "Settings";
    topMenu[2].style.display = "block";
    topMenu[3].style.display = "none";
    topMenu[4].style.display = "block";
    currPanel = settings;
}

function hideSettings(){
    var settings = document.getElementById("content-settings");
    settings.style.display = "none";
    var topMenu = document.getElementById("top-menu").children;
    //hide settings, show back
    topMenu[2].style.display = "none";
    topMenu[3].style.display = "block";
    topMenu[4].style.display = "none";
    //currPanel = settings;
}

initializeApp();
