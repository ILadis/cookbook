
export function Recipe() {
  Object.assign(this, ...arguments);

  for (let step of this.steps) {
    if ('ingredients' in step) {
      let ingredients = Recipe.ingredients(this, step);
      Object.defineProperty(step, 'ingredients', {
        value: { [Symbol.iterator]: ingredients }
      });
    }
  }

  for (let ingredient of this.ingredients) {
    if ('quantity' in ingredient) {
      let quantity = Recipe.quantity(this, ingredient);
      Object.defineProperty(ingredient, 'quantity', {
        get: quantity
      });
    }
  }

  return this;
}

Recipe.quantity = (recipe, { quantity }) => {
  let servings = recipe.servings.quantity;
  return function() {
    let factor = recipe.servings.quantity / servings;
    let value = quantity * factor;

    if (value <= 0.1) {
      return '';
    } else if (value >= 1) {
      return Number.isInteger(value)
        ? value.toString()
        : value.toFixed(0);
    }

    let fraction = Number.parseInt(1 / value);
    let codePoints = [
      0, 49, 189, 8531, 188, 8533, 8537, 8528, 8539, 8529, 8530
    ];

    return String.fromCodePoint(codePoints[fraction]);
  };
};

Recipe.ingredients = (recipe, { ingredients }) => {
  return function*() {
    let iterator = ingredients.values();

    for (let { ref, quantity } of iterator) {
      let ingredient = recipe.ingredients[ref];
      if (!ingredient) {
        continue;
      }

      if (!quantity) {
        quantity = ingredient.quantity;
      }

      yield Object.assign({ }, ingredient, { quantity });
    }
  };
};
