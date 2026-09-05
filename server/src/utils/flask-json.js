const snake = (key) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export function toFlaskJson(value) {
  if (Array.isArray(value)) return value.map(toFlaskJson);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [snake(key), toFlaskJson(item)]));
  }
  return value;
}

export function flaskJsonResponse(req, res, next) {
  const json = res.json.bind(res);
  res.json = (body) => json(toFlaskJson(body));
  next();
}
