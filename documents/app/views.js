
import { html, define, submitHandler } from './dom.js';

const DateFormat = new Intl.DateTimeFormat('de-DE', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
});

export const Shell = define('app-shell', 'div', html`
<div is="bottom-bar"></div>
<div is="upload-list"></div>
`, function() {
  this.contents = new Set();

  this.bottomBar = this.querySelector('[is=bottom-bar]');
  this.uploadList = this.querySelector('[is=upload-list]');
});

Shell.prototype.setTitle = function(title) {
  document.title = title;
};

Shell.prototype.setContent = function(...contents) {
  for (var content of this.contents) {
    content.remove();
  }

  this.contents.clear();
  while (content = contents.pop()) {
    this.prepend(content);
    this.contents.add(content);
  }
};

export const FileList = define('file-list', 'div', html`
<h1>Dokumente</h1>
<form>
  <input type="text" placeholder="Suchen">
</form>
<hr>
<ul></ul>`, function() {
  this.items = new Set();
});

FileList.prototype.setTitle = function(title) {
  let h1 = this.querySelector('h1');
  h1.textContent = title;
  return this;
};

FileList.prototype.focusSearch = function() {
  let input = this.querySelector('input');
  input.focus();
};

FileList.prototype.addItem = function() {
  let view = new FileList.Item();

  let ul = this.querySelector('ul');
  ul.appendChild(view);

  this.items.add(view);
  return view;
};

FileList.prototype.removeItem = function(view) {
  let ul = this.querySelector('ul');
  ul.removeChild(view);

  this.items.delete(view);
};

FileList.Item = define('file-list-item', 'li', html`
<h1></h1>
<h2></h2>
<h2></h2>
<hr>`, function() {
  this.onclick = () => this.onClicked();
});

FileList.Item.prototype.onClicked = function() { };

FileList.Item.prototype.setName = function(name) {
  let h1 = this.querySelector('h1');
  h1.textContent = name;
  return this;
};

FileList.Item.prototype.setSize = function(size) {
  let h2 = this.querySelector('h2:first-of-type');
  h2.textContent = size;
  return this;
};

FileList.Item.prototype.setDate = function(date) {
  let h2 = this.querySelector('h2:last-of-type');

  var date = DateFormat.format(new Date(date));
  h2.textContent = date;

  return this;
};

FileList.Item.prototype.addTag = function(tag, color) {
  let span = document.createElement('span');
  span.className = 'chip';
  span.textContent = tag;

  if (color) {
    span.classList.add(color);
  }

  let hr = this.querySelector('hr');
  this.insertBefore(span, hr);

  return this;
};

FileList.Item.prototype.clearTags = function() {
  let spans = this.querySelectorAll('span');
  for (let span of spans) {
    span.remove();
  }
};

export const FileDetails = define('file-details', 'div', html`
<h1></h1>
<form>
  <div>
    <label>Tags</label>
    <input type="text" name="tag">
  </div>
  <div>
    <label>Name</label>
    <input type="text" name="name">
  </div>
  <div>
    <label>Datum</label>
    <input type="date" name="date">
  </div>
</form>`, function() {
  let form = this.querySelector('form');
  let input = this.querySelector('[name=tag]');
  input.onchange =
  form.onsubmit = submitHandler((value) => this.onTagSubmitted(value));
});

FileDetails.prototype.onTagSubmitted = function(tag) { };

FileDetails.prototype.setName = function(name) {
  let h1 = this.querySelector('h1');
  h1.textContent = name;

  let input= this.querySelector('[name=name]');
  input.value = name;
};

FileDetails.prototype.setDate = function(date) {
  let input= this.querySelector('[name=date]');

  var date = new Date(date);
  input.valueAsDate = date;
};

FileDetails.prototype.addTag = function(tag, color) {
  let span = document.createElement('span');
  span.className = 'chip';
  span.textContent = tag;

  if (color) {
    span.classList.add(color);
  }

  let input = this.querySelector('input');
  let parent = input.parentNode;
  parent.insertBefore(span, input);

  return this;
};

/*
export const PdfFileViewer = define('pdf-file-viewer', 'div', html`
<styles>
[is=file-viewer] {
  position: fixed;
  padding: 26px 46px 110px 46px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

[is=file-viewer] > canvas {
  width: 100%;
  height: 100%;
  border: none;
}
</styles>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.min.js"></script>
<canvas></canvas>`, function() {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';
});

PdfFileViewer.prototype.setUrl = async function({ url }) {
  let task = pdfjsLib.getDocument(url);

  let pdf = await task.promise;
  let page = await pdf.getPage(1);

  let scale = 1;
  let viewport = page.getViewport({ scale });

  let canvas = this.querySelector('canvas');
  let context = canvas.getContext('2d');

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  page.render({
    canvasContext: context,
    viewport: viewport
  });
};*/

export const UploadList = define('upload-list', 'div', html`
<hr hidden>
<ul></ul>`, function() {
  this.items = new Set();
});

UploadList.prototype.addItem = function() {
  let [hr, ul] = this.querySelectorAll('hr, ul');
  hr.hidden = false;

  let view = new UploadList.Item();
  ul.appendChild(view);

  this.items.add(view);
  return view;
};

UploadList.prototype.removeItem = function(view) {
  let ul = this.querySelector('ul');
  ul.removeChild(view);

  this.items.delete(view);
};

UploadList.prototype.pullUp = function() {
  let li = this.querySelector('ul > :last-child');

  if (li) {
    let options = { behavior: 'smooth' };
    let scroll = () => li.scrollIntoView(options);
    setTimeout(scroll, 100);
  }
};

UploadList.Item = define('upload-list-item', 'li', html`
<h1></h1>
<h2></h2>
<div><span></span></div>
<hr>`);

UploadList.Item.prototype.setName = function(name) {
  let h1 = this.querySelector('h1');
  h1.textContent = name;
  return this;
};

UploadList.Item.prototype.setProgress = function(percent) {
  var percent = Math.round(percent) + '%';

  let [h2, span] = this.querySelectorAll('h2, span');
  span.style.width = percent;
  h2.textContent = percent;

  return this;
};

export const BottomBar = define('bottom-bar', 'div', html`
<form>
  <input type="file" multiple>
  <svg viewBox="0 0 24 24"><use></use></svg>
</form>
<nav></nav>
<template id="action">
  <svg viewBox="0 0 24 24"><use></use></svg>
</template>`);

BottomBar.prototype.setFloatingAction = function(icon, handler, files) {
  let [form, input] = this.querySelectorAll('form, [type=file]');

  form.hidden = false;
  input.onchange = () => {
    let files = Array.from(input.files);
    form.reset();
    handler(files);
  };

  let [svg, use] = form.querySelectorAll('svg, use');
  svg.onclick = () => files ? input.click() : handler();
  use.setAttribute('href', '#' + icon);

  return this;
};

BottomBar.prototype.addAction = function(icon, handler) {
  let template = this.querySelector('#action');
  let nav = this.querySelector('nav');

  let node = template.content.cloneNode(true);

  let [svg, use] = node.querySelectorAll('svg, use');
  svg.onclick = handler;
  use.setAttribute('href', '#' + icon);

  nav.appendChild(node);

  return this;
};

BottomBar.prototype.clearActions = function() {
  let form = this.querySelector('form');
  form.hidden = true;

  let svgs = this.querySelectorAll('nav svg');
  for (let svg of svgs) {
    svg.remove();
  }
};

