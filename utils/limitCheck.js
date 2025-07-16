function checkAndIncrementLimit(user, field, limit = 5) {
  const today = new Date().toDateString();
  const attempts = user[field];

  if (!attempts.date || new Date(attempts.date).toDateString() !== today) {
    user[field] = { count: 1, date: new Date() };
    return { allowed: true, remaining: limit - 1 };
  }

  if (attempts.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  user[field].count += 1;
  return { allowed: true, remaining: limit - user[field].count };
}

module.exports = checkAndIncrementLimit;
