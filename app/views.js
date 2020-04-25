
export function Shell() {
}

Shell.prototype.setTitle = function(title) {
  document.title = title;
};

Shell.prototype.setContent = function(content) {
  let child = document.body.firstChild;
  document.body.replaceChild(content, child);
};

export const Index = define('recipe-index', 'div', html`
<header>
  <h1>
    <a></a>
    <span><!-- title --></span>
  </h1>
  <input type="search" placeholder="Suchbegriff...">
</header>
<section>
  <ol><!-- recipes --></ol>
  <button></button>
</section>`, function() {
  let buttons = this.querySelectorAll('a, button');
  buttons[0].onclick = () => this.onRefreshClicked();
  buttons[1].onclick = () => this.onCreateClicked();

  let input = this.querySelector('header input');
  input.oninput = () => this.onQueryChanged(input.value);

  this.recipes = new Set();
});

Index.prototype.setTitle = function(title) {
  let span = this.querySelector('header h1 span');
  span.textContent = title;
};

Index.prototype.onRefreshClicked = function() {
};

Index.prototype.onCreateClicked = function() {
};

Index.prototype.onQueryChanged = function(query) {
};

Index.prototype.addRecipe = function() {
  let ol = this.querySelector('section ol');

  let view = new Index.Recipe();
  ol.appendChild(view);

  this.recipes.add(view);
  return view;
};

Index.prototype.removeRecipe = function(view) {
  let ol = this.querySelector('section ol');
  ol.removeChild(view);
  this.recipes.delete(view);
};

Index.Recipe = define('index-item', 'li', html`<span><!-- name --></span>`, function() {
  this.onclick = () => this.onClicked();
});

Index.Recipe.prototype.setName = function({ name }) {
  let span = this.querySelector('span');
  span.textContent = name;
  return this;
};

Index.Recipe.prototype.onClicked = function() {
};

export const Recipe = define('recipe-details', 'div', html`
<header>
  <h1>
    <a></a>
    <span><!-- name --></span>
  </h1>
  <h2>
    <button>-</button>
    <span><!-- servings --></span>
    <button>+</button>
  </h2>
  <ul><!-- (quantity unit) ingredient --></ul>
</header>
<section>
  <h2><!-- steps --></h2>
  <ol><!-- (ingredients) step --></ol>
</section>`, function() {
  let buttons = this.querySelectorAll('a, button');
  buttons[0].onclick = () => this.onEditClicked();
  buttons[1].onclick = () => this.onServingsClicked(-1);
  buttons[2].onclick = () => this.onServingsClicked(+1);

  this.ingredients = new Set();
  this.steps = new Set();
});

Recipe.prototype.setName = function({ name }) {
  let span = this.querySelector('header h1 span');
  span.textContent = name;
  return this;
};

Recipe.prototype.setServings = function({ servings }) {
  let span = this.querySelector('header h2 span');
  span.textContent = `Zutaten für ${servings}`;
  return this;
};

Recipe.prototype.onServingsClicked = function(delta) {
};

Recipe.prototype.addIngredient = function() {
  let ul = this.querySelector('header ul');

  let view = new Recipe.Ingredient();
  ul.appendChild(view);

  this.ingredients.add(view);
  return view;
};

Recipe.prototype.addStep = function() {
  let h2 = this.querySelector('section h2');
  h2.textContent = 'Zubereitung';

  let ol = this.querySelector('section ol');

  let view = new Recipe.Step();
  ol.appendChild(view);

  this.steps.add(view);
  return view;
};

Recipe.Ingredient = define('details-ingredient', 'li', html`<span><!-- (quantity unit) ingredient --></span>`);

Recipe.Ingredient.prototype.setLabel = function({ name, quantity }) {
  let label = quantity + ' ' + name;
  let span = this.querySelector('span');
  span.textContent = label;
  return this;
};

Recipe.Step = define('details-step', 'li', html`
<h3><!-- ingredients --></h3>
<ul><!-- (quantity unit) ingredient --></ul>
<span><!-- step --></span>`, function() {
  this.ingredients = new Set();
});

Recipe.Step.prototype.setText = function({ text, ingredients }) {
  let h3 = this.querySelector('h3');
  h3.textContent = 'Zutaten';
  h3.hidden = ingredients.size == 0;

  let span = this.querySelector('span');
  span.textContent = text;
  return this;
};

Recipe.Step.prototype.addIngredient = function() {
  let ul = this.querySelector('ul');

  let view = new Recipe.Ingredient();
  ul.appendChild(view);

  this.ingredients.add(view);
  return view;
};

export const Form = define('recipe-form', 'div', html`
<header>
  <h1>
    <a name="delete"></a>
    <a name="export"></a>
    <a name="done"></a>
    <span><!-- title --></span>
  </h1>
  <!-- name + servings -->
  <fieldset name="label">
    <legend>Bezeichnung</legend>
    <input type="text">
  </fieldset>
  <fieldset name="servings">
    <legend>Mengenangabe</legend>
    <input type="text">
    <select>
      <option>Stück</option>
      <option>Personen</option>
      <option value="other">andere...</option>
    </select>
  </fieldset>
</header>
<section>
  <ol><!-- steps + ingredients --></ol>
  <button></button>
</section>`, function() {
  let buttons = this.querySelectorAll('a, button');
  buttons[0].onclick = () => this.onDeleteClicked();
  buttons[1].onclick = () => this.onExportClicked();
  buttons[2].onclick = () => this.onDoneClicked();
  buttons[3].onclick = () => this.onAddStepClicked();

  let inputs = this.querySelectorAll('fieldset input');
  inputs[0].onchange = ({ target }) => this.onLabelChanged(target.value);
  inputs[1].onchange = ({ target }) => this.onQuantityChanged(target.value);

  let select = this.querySelector('fieldset select');
  select.onchange = ({ target }) => target.value === 'other'
    ? this.onOtherUnitClicked()
    : this.onUnitChanged(target.value);

  this.steps = new Set();
});

Form.prototype.setTitle = function(title) {
  let span = this.querySelector('header h1 span');
  span.textContent = title;
};

Form.prototype.onDoneClicked = function() {
};

Form.prototype.setExportUrl = function(name, url) {
  let a = this.querySelector('header a[name=export]');
  if (!name || !url) {
    a.removeAttribute('download');
    a.removeAttribute('href');
  } else {
    a.setAttribute("download", name);
    a.setAttribute("href", url);
  }
};

Form.prototype.onExportClicked = function() {
};

Form.prototype.onDeleteClicked = function() {
};

Form.prototype.setLabel = function({ name }) {
  let input = this.querySelector('fieldset[name=label] input');
  input.value = name || '';
};

Form.prototype.onLabelChanged = function(name) {
};

Form.prototype.setServings = function({ servings }) {
  let input = this.querySelector('fieldset[name=servings] input');
  input.value = servings.value || '';

  let select = this.querySelector('fieldset[name=servings] select');

  let byUnit = o => o.textContent === servings.unit;
  let option = Array.from(select.options).find(byUnit);

  if (!option && servings.unit) {
    option = document.createElement('option');
    option.textContent = servings.unit;
    select.prepend(option);
  }

  if (!option) {
    option = select.options[0];
  }

  option.selected = true;
};

Form.prototype.onQuantityChanged = function(quantity) {
};

Form.prototype.onUnitChanged = function(unit) {
};

Form.prototype.onOtherUnitClicked = function() {
};

Form.prototype.promptForUnit = function() {
  // replace this with HTML5 dialog once it's usable
  let unit = prompt('Einheit für Mengenangabe angeben:');
  this.onUnitChanged(unit);
};

Form.prototype.addStep = function() {
  let ol = this.querySelector('section ol');

  let view = new Form.Step();
  ol.appendChild(view);

  let options = { behavior: 'smooth' };
  let scroll = () => view.scrollIntoView(options);
  setTimeout(scroll, 100);

  this.steps.add(view);
  return view;
};

Form.prototype.removeStep = function(view) {
  let ol = this.querySelector('section ol');
  ol.removeChild(view);
  this.steps.delete(view);
};

Form.prototype.onAddStepClicked = function() {
};

Form.Step = define('form-step', 'li', html`
<form><input type="text" placeholder="Zutaten hinzufügen"></form>
<textarea rows="1" placeholder="Arbeitsschritte beschreiben"></textarea>`, function() {
  let form = this.querySelector('form');
  let input = this.querySelector('form input');
  input.onchange =
  form.onsubmit = submitHandler(input, (value) => this.onIngredientSubmitted(value));

  let textarea = this.querySelector('textarea');
  textarea.onchange = () => this.onStepTextChanged(textarea.value);
  textarea.oninput = autoResizeHandler();

  this.ingredients = new Set();
});

Form.Step.prototype.setStepText = function({ text }) {
  let textarea = this.querySelector('textarea');
  textarea.value = text || '';

  let event = new Event('input');
  textarea.dispatchEvent(event);
};

Form.Step.prototype.onStepTextChanged = function(text) {
};

Form.Step.prototype.addIngredient = function() {
  let view = new Form.Step.Ingredient();

  let span = this.querySelector('span:last-of-type');
  if (span) {
    this.insertBefore(view, span.nextSibling);
  } else {
    this.prepend(view);
  }

  this.ingredients.add(view);
  return view;
};

Form.Step.prototype.removeIngredient = function(view) {
  this.removeChild(view);
  this.ingredients.delete(view);
};

Form.Step.prototype.onIngredientSubmitted = function(ingredient) {
};

Form.Step.Ingredient = define('form-ingredient', 'span', html``, function() {
  this.onclick = () => this.onClicked();
});

Form.Step.Ingredient.prototype.onClicked = function() {
};

Form.Step.Ingredient.prototype.setLabel = function({ name, quantity }) {
  let label = quantity + ' ' + name;
  this.textContent = label;
  return this;
};

function html(source) {
  let template = document.createElement('template');
  template.innerHTML = source[0];

  let content = document.importNode(template.content, true);
  return content;
}

function define(tag, base, template, init) {
  let proto = document.createElement(base).constructor;
  let options = { extends: base };

  let element = (class extends proto {
    constructor() {
      super();
      this.appendChild(template.cloneNode(true));
      this.setAttribute('is', tag);
      normalizeNodes(this);
      if (init) init.call(this);
    }
  });

  customElements.define(tag, element, options);
  return element;
}

function autoResizeHandler() {
  return ({ target }) => {
    target.style.height = 'auto';
    target.style.height = (target.scrollHeight) + 'px';
  };
}

function submitHandler(input, delegate) {
  return (event) => {
    event.preventDefault();
    if (input.value.length) {
      delegate(input.value);
      input.value = '';
    }
  };
}

function normalizeNodes(node) {
  let childs = node.childNodes;
  for (let child of childs) {
    let text = child.textContent;
    let type = child.nodeType;

    switch (type) {
    case Node.TEXT_NODE:
      child.textContent = text.trim();
      break;
    case Node.COMMENT_NODE:
      child.remove();
      break;
    }
    normalizeNodes(child);
  }
  return node;
}

