window.addEventListener("load", init);

let USERS = {};

let global = {};
const container = document.getElementById("main-container");
const canvas = document.getElementById("canvas");
const thumb = document.getElementById("scroll-thumb");

const MAX_HEIGHT = 10000;

function init() {
    initCanvas();
    initSelectors();
    console.log("Frontend JS initialized");
}

HTMLElement.prototype.val = function(value) {
    if (this.classList.contains("selector-head")) {
        if (value == null) {
            return this.getAttribute("value");
        } else {
            this.setAttribute("value", value);
            this.childTag("SPAN")[0].textContent = value;
        }
    }
}

function initSelectors() {
    const windowEvent = function(e) {
        for (let head of cl("selector-head")) {
            if (head.childTag("INPUT")[0] != e.target) {
                head.childTag("INPUT")[0].checked = false;
            }
        }
    }
    window.removeEventListener("click", windowEvent);
    window.addEventListener("click", windowEvent);

    for (let head of cl("selector-head")) {
        if (head.attr("value") == "") {
            head.val(head.childClass("selector-options")[0].children[0].textContent);
        } else {
            head.val(head.attr("value"));
        }

        for (let option of head.childClass("selector-options")[0].children) {
            option.addEventListener("click", function() {
                head.val(this.textContent);
                head.onchange(head);
            });
            option.addEventListener("touchstart", function() {
                head.val(this.textContent);
                head.onchange(head);
            });
        }
    }
}

HTMLElement.prototype.createSelector = function(options, def) {
    const head = el("div").class("selector-head");
    const span = head.el("span");
    const check = head.el("input").attr("type", "checkbox");
    const optionsList = head.el("ul").class("selector-options");
    for (let option of options) {
        const opt = optionsList.el("li").text(option);
    }
    const arrow = head.el("i").class("gg-chevron-down")
    this.appendChild(head);
    check.style.height = head.clientHeight+"px";
    head.attr("value", (def != null ? def : options[0]));
    initSelectors();
    return head;
}

function initCanvas() {
    global.ctx = canvas.getContext("2d");
    const ctx = global.ctx;
    
    container.onscroll = function() {
        if ((container.scrollTop+container.clientHeight)/container.scrollHeight > 0.9 && container.scrollHeight < 10000) {
            canvas.style.height = canvas.clientHeight + 1000 + "px";
            refactorHeight();
        }
        adjustScrollThumb();
    }
    
    const pos = {x: 0, y: 0};
    global.defaultCanvasSize = {
        width: canvas.clientWidth,
        height: canvas.clientHeight
    };
    resize();

    window.addEventListener('resize', refactorHeight);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mousedown", setPosition);
    canvas.addEventListener("mouseenter", setPosition);
    canvas.addEventListener("mouseout", function(e) {
        if (document.getElementsByClassName("canvas-cursor").length > 0) {
            document.getElementsByClassName("canvas-cursor")[0].remove();
        }
    });


    function resize() {
        ctx.canvas.width = canvas.clientWidth;
        ctx.canvas.height = canvas.clientHeight;
    }

    function refactorHeight() {
        const url = canvas.toDataURL("image/png");
        resize();
        const image = new Image();
        image.onload = function() {
            ctx.drawImage(image, 0, 0);
        }
        image.src = url;
    }

    function setPosition(e) {
        pos.x = e.clientX;
        pos.y = e.clientY-canvas.offsetTop+container.scrollTop;

        if (global.drawTool == "eraser") {
            if (document.getElementsByClassName("canvas-cursor").length == 0) {
                const c = document.createElement("div");
                c.className = "canvas-cursor";
                document.body.appendChild(c);
            }
        }
    }

    global.drawColor = "#000000";
    global.lineWidth = 3;
    global.drawTool = "pencil";
    global.highlightSize = 30;
    function draw(e) {
        // Set eraser cursor position
        if (global.drawTool == "eraser") {
            const cursor = document.getElementsByClassName("canvas-cursor")[0];

            cursor.style.left = pos.x-(cursor.clientWidth/2)+"px";
            cursor.style.top = pos.y+canvas.offsetTop-container.scrollTop-(cursor.clientHeight/2)+"px";
            cursor.style.width = "40px";

            canvas.style.cursor = "none";
        } else {
            canvas.style.cursor = "auto";
        }

        if (e.buttons !== 1) {return setPosition(e);}

        ctx.beginPath();

        // Formatting

        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = global.lineWidth;
        ctx.lineCap = "round";
        ctx.globalAlpha = 1;
        if (global.drawTool == "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = 40;
        } else if (global.drawTool == "highlighter") {
            ctx.globalCompositeOperation = "multiply";
            ctx.fillStyle = "#ff0";
            ctx.fillRect(pos.x-10, pos.y-10, global.highlightSize, global.highlightSize);
            setPosition(e);
            return;
        }

        ctx.strokeStyle = global.drawColor;

        ctx.moveTo(pos.x, pos.y);
        setPosition(e);
        ctx.lineTo(pos.x, pos.y);

        ctx.stroke();
    }
}

function selectTool(button) {
    for (let tool of document.getElementsByClassName("toolbar-draw-tool")) {
        if (tool.classList.contains("selected-tool")) {
            tool.classList.remove("selected-tool");
        }
    }
    button.classList.add("selected-tool");
    global.drawTool = button.id.split("-")[0];
    if (global.drawTool != "eraser") {
        if (document.getElementsByClassName("canvas-cursor").length > 0) {
            document.getElementsByClassName("canvas-cursor")[0].remove();
        }
    }
}

function setColor(picker) {
    global.drawColor = picker.value;
}

function setLineWidth(el) {
    const str = el.val();
    global.lineWidth = parseInt(str.substring(0, str.length-1));
    console.log(global.lineWidth)
}

function clearCanvas() {
    global.ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.width = global.defaultCanvasSize.width+4+"px";
    canvas.style.height = global.defaultCanvasSize.height+"px";
    global.ctx.canvas.width = canvas.clientWidth+4;
    global.ctx.canvas.height = canvas.clientHeight;
}

let scrollInterval;
function beginScroll(direction, mult=1) {
    const SCROLL_SPEED = 3;
    scrollInterval = setInterval(() => {
        if (direction) {
            container.scrollTop += SCROLL_SPEED*mult;
        } else {
            container.scrollTop -= Math.min(Math.max(container.scrollTop, 0), SCROLL_SPEED*mult);
        }
        adjustScrollThumb();
    }, 1);
}

function stopScroll() {
    if (typeof scrollInterval != "undefined") {
        clearInterval(scrollInterval);
    }
}

function scrollToTop() {
    container.scrollTop = 0;
}

function scrollToBottom() {
    container.scrollTop = container.scrollHeight;
}

function adjustScrollThumb() {
    thumb.style.top = ((container.scrollTop/container.scrollHeight)*(thumb.parentNode.clientHeight-(thumb.clientHeight/2)-5))+"px";
}