import { QUIZ_QUESTIONS } from '../src/data/quizQuestions';

const byTrail: Record<string, Record<string, number>> = {
  firewall: {}, fundamentos: {}, avancados: {},
};
QUIZ_QUESTIONS.forEach((q) => {
  byTrail[q.trail][q.badge] = (byTrail[q.trail][q.badge] || 0) + 1;
});

for (const t of ['firewall', 'fundamentos', 'avancados']) {
  const e = Object.entries(byTrail[t]).sort((a, b) => a[1] - b[1]);
  console.log(`\n=== ${t} (${e.length} badges, ${e.reduce((s, x) => s + x[1], 0)} q) ===`);
  e.forEach(([b, c]) => console.log(`${c < 3 ? ' AVISO ' : '       '}${c}  ${b}`));
}
