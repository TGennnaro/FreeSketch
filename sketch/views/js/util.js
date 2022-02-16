function id(i) {
    return document.getElementById(i);
}

function cl(c) {
    return document.getElementsByClassName(c);
}

function tag(t) {
    return document.getElementsByTagName(t);
}

function el(e) {
    return document.createElement(e);
}

HTMLElement.prototype.el = function(e) {
    const n = el(e);
    this.appendChild(n);
    return n;
}

HTMLElement.prototype.class = function(cl) {
    this.classList.add(cl);
    return this;
}

HTMLElement.prototype.text = function(t) {
    this.textContent = t;
    return this;
}

HTMLElement.prototype.attr = function(a, v) {
    if (v != null) {
        this.setAttribute(a, v);
        return this;
    } else {
        return this.getAttribute(a);
    }
}

HTMLElement.prototype.childClass = function(cl) {
    let ret = [];
    for (let child of this.children) {
        if (child.classList.contains(cl)) {
            ret.push(child);
        }
    }
    return ret;
}

HTMLElement.prototype.childTag = function(tag) {
    let ret = [];
    for (let child of this.children) {
        if (child.tagName == tag) {
            ret.push(child);
        }
    }
    return ret;
}

HTMLElement.prototype.getPath = function(){
    let parent = this;
    let path = [this];
    while (parent.parentNode){
        parent = parent.parentNode;
        path.push(parent);
    }
    return path;
}

HTMLElement.prototype.show = function() {
    this.style.display = null;
}

HTMLElement.prototype.hide = function() {
    this.style.display = "none";
}

function copy(text){
    var node = document.createElement('textarea');
    var selection = document.getSelection();

    node.textContent = text;
    document.body.appendChild(node);

    selection.removeAllRanges();
    node.select();
    document.execCommand('copy');

    selection.removeAllRanges();
    document.body.removeChild(node);
}