
const words = new RegExp('\\S+', 'g');

export function Search(objects) {
  this.objects = objects;
}

Search.prototype.execute = function(query, contents) {
  let terms = query.match(words) || [];

  this.results = new Map();
  for (let term of terms) {
    let idf = inverseFrequency(term, this.objects, contents);
    for (let object of this.objects) {
      let tf = termFrequency(term, object, contents);

      let score = this.results.get(object) || 0;
      score += tf * idf;

      if (score > 0) {
        this.results.set(object, score);
      }
    }
  }
};

Search.prototype.values = function*() {
  while (this.results.size > 0) {
    let highest = 0, next;
    for (let [object, score] of this.results) {
      if (score > highest) {
        highest = score;
        next = object;
      }
    }
    this.results.delete(next);
    yield next;
  }
};

function inverseFrequency(term, objects, contents) {
  let count = 1, frequency = 0;

  for (let object of objects) {
    count++;
    for (let content of contents(object)) {
      if (content.includes(term)) {
        frequency++;
        break;
      }
    }
  }

  return !frequency ? 0 : Math.log(count / frequency);
}

function termFrequency(term, object, contents) {
  let frequency = 0;

  for (let content of contents(object)) {
    let position = 0;
    while (true) {
      let index = content.indexOf(term, position);
      if (index != -1) {
        position += term.length;
        frequency++;
      } else break;
    }
  }

  return frequency;
}

