import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';

const roots = ['blog', 'class', 'undergrad', 'presentations', 'pubs', 'css', 'js', 'images', 'img', 'notes.html', 'presentations.html', '404.html'];
const include = (path) => !path.startsWith('undergrad/resume') &&
  !path.split('/').some((part) => part.startsWith('.') || part.endsWith('~') || /\.(swp|swo|bak)$/i.test(part));

async function files(path) {
  if (!include(path)) return [];
  if (!(await stat(path)).isDirectory()) return [path];
  return (await Promise.all((await readdir(path)).map((name) => files(`${path}/${name}`)))).flat();
}

test('new pages are semantic previews with working local references', async () => {
  for (const page of ['dist/index.html', 'dist/research/index.html']) {
    const html = await readFile(page, 'utf8');
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.match(html, /<html lang="en"/);
    assert.match(html, /name="viewport"/);
    assert.match(html, /noindex, nofollow/);
    if (page === 'dist/index.html') assert.doesNotMatch(html, /<script/);
    assert.doesNotMatch(html, /google-analytics|mailto:|tel:|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b\d{3}[- .]\d{3}[- .]\d{4}\b/i);
    assert.doesNotMatch(html, /Finding the useful structure|From a good idea|Research-minded|Research rigor|Learning more|Let's compare notes/i);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, reference] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|data:)/.test(reference)) continue;
      const url = new URL(reference, `https://preview.local/${page.replace(/^dist\//, '')}`);
      let path = url.pathname;
      if (path.endsWith('/')) path += 'index.html';
      const target = resolve('dist', `.${path}`);
      await stat(target);
      if (url.hash) {
        const targetHtml = await readFile(target, 'utf8');
        assert.ok(targetHtml.includes(`id="${url.hash.slice(1)}"`), `${reference} missing anchor in ${page}`);
      }
    }
  }
});

test('experience starts with Amazon and the original portrait is restored uncropped', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  assert.doesNotMatch(html, /Northrop Grumman|Research Assistant/);
  const timeline = html.match(/<ol class="timeline">([\s\S]*?)<\/ol>/)?.[1];
  assert.ok(timeline);
  assert.equal((timeline.match(/<li(?:\s|>)/g) || []).length, 3);
  for (const employer of ['Microsoft', 'Qualtrics', 'Amazon']) assert.ok(timeline.includes(employer));
  assert.match(html, /<img[^>]+src="\/images\/danny_redback.jpg"[^>]+width="120"[^>]+height="200"/);
});

test('every included legacy file is preserved byte-for-byte', async () => {
  for (const root of roots) {
    for (const file of await files(root)) {
      const original = await readFile(file);
      const copied = await readFile(resolve('dist', file));
      const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
      assert.equal(hash(copied), hash(original), file);
    }
  }
});

test('historical resume documents are not in candidate output', async () => {
  await assert.rejects(stat('dist/undergrad/resume'), { code: 'ENOENT' });
  assert.ok((await stat(dirname('dist/index.html'))).isDirectory());
});

test('research includes LinkedIn and original website publications while homepage stays selected', async () => {
  const research = await readFile('dist/research/index.html', 'utf8');
  const home = await readFile('dist/index.html', 'utf8');
  assert.equal((research.match(/<article class="story"[^>]*>/g) || []).length, 17);
  assert.equal((home.match(/<article class="story">/g) || []).length, 3);
  for (const title of [
    'Improving Training Efficiency and Reducing Maintenance Costs',
    'Effective Proxy for Human Labeling',
    'Compressing Cross-Lingual Multi-Task Models',
    'Optimal Subarchitecture Extraction For BERT',
    'Allocation Strategies for High Fidelity Models',
    'Nyström Sketches',
    'Augmented Leverage Score Sampling with Bounds',
    'Streaming Kernel Principal Component Analysis',
    'Automatic Classification of Scar Tissue',
    'Visualization of Topology Optimization Designs with Representative Subset Selection',
    'Automatic Left-Atrial Scar Assessment',
    'Intensity Inhomogeneity Correction',
    'Evaluation of Inter-observer and Intra-observer Agreement',
    'An Open-Access Grand Challenge',
    'Data Analysis and Visualization using Basis Selection for Matrix Approximation',
    'Solving Geometric Constraint Problems with Monte Carlo Optimization',
    'Cloud Modeling and Rendering',
  ]) assert.ok(research.includes(title), `Missing publication: ${title}`);
  for (const resource of [
    'pubs/skpca-poster.pdf',
    'arxiv.org/abs/1512.05059',
    'github.com/daniel-perry/StreamingKPCA.jl',
  ]) assert.ok(research.includes(resource), `Missing resource: ${resource}`);
  assert.doesNotMatch(research, /Research-page preview|later migration milestone/);
});

test('experience comes first and research entries have type and topic filters', async () => {
  const home = await readFile('dist/index.html', 'utf8');
  assert.ok(home.indexOf('id="experience"') < home.indexOf('id="work"'));
  assert.match(home, /01 \/ Experience/);
  assert.match(home, /02 \/ Selected publications/);
  assert.match(home, /My dissertation/);
  const research = await readFile('dist/research/index.html', 'utf8');
  assert.equal((research.match(/<article[^>]+data-type="[^"]+" data-topic="[^"]+"/g) || []).length, 17);
  assert.match(research, /data-filter="type"/);
  assert.match(research, /data-filter="topic"/);
  assert.match(research, /role="status"/);
});
