// Kompaktní zápis sad otázek.
//
//   set('Název', 'Téma', 'Ročník',
//     'Text otázky?~2|Odpověď:40|Další odpověď:32',
//     …)
//
// Za text otázky lze přidat ~1 až ~3 = obtížnost. Ta funguje jako násobič bodů
// celé otázky (×1 snadná, ×2 střední, ×3 těžká). Body u odpovědí dál znamenají
// četnost v anketě a sčítají se přibližně ke stovce.
//
// Odpovědi se zapisují jako "text:body", body 1–99. Server je stejně seřadí
// sestupně, ale v datech je držíme rovnou od nejvyšší, ať se to dobře čte.

function q(line) {
  const [head, ...rest] = line.split('|');
  let question = head.trim();
  let difficulty = 1;
  const m = /~([123])$/.exec(question);
  if (m) { difficulty = Number(m[1]); question = question.slice(0, m.index).trim(); }
  return {
    question,
    difficulty,
    answers: rest.map(part => {
      const i = part.lastIndexOf(':');
      if (i < 1) throw new Error(`Chybí body u odpovědi: "${part}" (otázka: ${question})`);
      const text = part.slice(0, i).trim();
      const points = Number(part.slice(i + 1));
      if (!text) throw new Error(`Prázdná odpověď v otázce: ${question}`);
      if (!Number.isInteger(points) || points < 1 || points > 99)
        throw new Error(`Body mimo rozsah 1–99: "${part}" (otázka: ${question})`);
      return { text, points };
    }),
  };
}

function set(title, topic, grade, ...lines) {
  const questions = lines.map(q);
  if (questions.length < 10)
    throw new Error(`Sada "${title}" má jen ${questions.length} otázek, minimum je 10.`);
  for (const item of questions) {
    if (item.answers.length < 2 || item.answers.length > 8)
      throw new Error(`Otázka "${item.question}" má ${item.answers.length} odpovědí (povoleno 2–8).`);
  }
  return { title, topic, grade, questions };
}

module.exports = { q, set };
