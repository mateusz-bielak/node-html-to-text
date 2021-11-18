
const test = require('ava');

const { htmlToMarkdown } = require('../src/html-to-md');


const snapshotMacro = test.macro({
  exec: function (t, html, options = undefined) {
    t.snapshot(htmlToMarkdown(html, options), '```html\n' + html + '\n```');
  }
});

function tagsSequence (tagNames) {
  return tagNames.map(s => `<${s}>${s}</${s}>`).join('');
}

test(
  'common block-level elements',
  snapshotMacro,
  tagsSequence([
    'article', 'aside', 'div', 'figure', 'figcaption',
    'footer', 'form', 'header', 'main', 'nav', 'p', 'section'
  ])
);

test(
  'block with custom spacing',
  snapshotMacro,
  tagsSequence([
    'div', 'div', 'p', 'p', 'div', 'div'
  ]),
  {
    selectors: [
      { selector: 'p', options: { leadingLineBreaks: 4, trailingLineBreaks: 3 } }
    ]
  }
);

test(
  'default formatter is inline',
  snapshotMacro,
  'Lorem <span>ipsum <foo>dolor</foo></span> met'
);

test(
  'headings',
  snapshotMacro,
  tagsSequence([
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'
  ])
);

test(
  'horizontal lines (default)',
  snapshotMacro,
  `a<hr>b\n<hr />\nc`
);

test(
  'horizontal lines (custom)',
  snapshotMacro,
  `a<hr>b\n<hr />\nc`,
  {
    selectors: [
      { selector: 'hr', options: { string: '* * *' } }
    ]
  }
);

test(
  'pre',
  snapshotMacro,
  '<P>Code fragment:</P><PRE>  body {\n    color: red;\n  }</PRE>'
);

test(
  'blockquote',
  snapshotMacro,
  'foo<blockquote>quote</blockquote>bar'
);

test(
  'img',
  snapshotMacro,
  '<img src="test.png" alt="alt text" title="title">'
);

test(
  'link',
  snapshotMacro,
  '<a href="/test.html">test</a>'
);

test(
  'email link',
  snapshotMacro,
  '<a href="mailto:foo@example.com">mail me</a>'
);

test(
  'anchor link',
  snapshotMacro,
  '<a href="#anchor">test</a>'
);

test(
  'bold, strong',
  snapshotMacro,
  '<b>bold</b>, <strong>strong</strong>'
);

test(
  'italic, emphasis',
  snapshotMacro,
  '<i>italic</i>, <em>emphasis</em>'
);

test(
  'strikethrough, del',
  snapshotMacro,
  '<s>strikethrough</s>, <del>deleted</del>'
);

test(
  'inline code',
  snapshotMacro,
  'Lorem ipsum <code>code</code> dolor sit'
);

test(
  'sub, sup',
  snapshotMacro,
  'x<sub>2</sub>, x<sup>2</sup>'
);

test(
  'kbd',
  snapshotMacro,
  '<kbd>Ctrl</kbd> + <kbd>C</kbd>'
);

test(
  'figure',
  snapshotMacro,
  /*html*/`
    <figure>
      <img src="/media/image.jpg"
          alt="Alt test">
      <figcaption>Caption</figcaption>
    </figure>
  `
);

test(
  'picture - ignore sources',
  snapshotMacro,
  /*html*/`
    <picture>
      <source srcset="/media/cc0-images/surfer-240-200.jpg"
              media="(min-width: 800px)">
      <img src="/media/cc0-images/painted-hand-298-332.jpg" alt="Alt text" />
    </picture>
  `
);

test(
  'definition lists (default compatible mode)',
  snapshotMacro,
  /*html*/`
    <dl>
      <dt>Title 1</dt>
      <dd>Definition 1</dd>
      <dt>Title 2a</dt>
      <dt>Title 2b</dt>
      <dd>Definition 2a</dd>
      <dd>Definition 2b</dd>
    </dl>
  `
);

test(
  'definition list with divs',
  snapshotMacro,
  /*html*/`
    <dl>
      <div>
        <dt>Title 1</dt>
        <dd>Definition 1</dd>
      </div>
      <div>
        <dt>Title 2a</dt>
        <dt>Title 2b</dt>
        <dd>Definition 2a</dd>
        <dd>Definition 2b</dd>
      </div>
    </dl>
  `
);

test(
  'definition lists (native syntax for supported systems)',
  snapshotMacro,
  /*html*/`
    <dl>
      <dt>Title 1</dt>
      <dd>Definition 1</dd>
      <dt>Title 2a</dt>
      <dt>Title 2b</dt>
      <dd>Definition 2a</dd>
      <dd>Definition 2b</dd>
    </dl>
  `,
  {
    selectors: [
      { selector: 'dl', format: 'definitionList' }
    ]
  }
);

test(
  'unordered list',
  snapshotMacro,
  /*html*/`
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  `
);

test(
  'ordered list',
  snapshotMacro,
  /*html*/`
    <ol>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ol>
  `
);

test(
  'ordered list with start index and type',
  snapshotMacro,
  /*html*/`
    <ol type="i" start="11">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ol>
  `
);