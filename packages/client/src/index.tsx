import { h } from 'haptic';
import { s } from 'haptic/s';
import { css, colours, cl, sizes, decl } from 'styletakeout.macro';
import { c, styles } from './styles.js';
import { data } from './data.js';

import { TilesCanvas } from './visual/tiles.js';
import { Palette } from './visual/palette.js';
import { ArrowButton } from './visual/arrowbutton.js';
import { ColourPicker } from './visual/colourpicker.js';

const lzDataText = s('');

const {
  click,
  hover,
  tiles: { tileCountX, tileCountY, tileSizePx },
} = data;

const ClickButton = ({ text, fn }: { text: string, fn: () => unknown }) =>
  <button class={styles.ButtonBlue} type="button" onClick={fn}>{text}</button>;

const Page = () =>
  <main>
    <section class={c(cl.vspace, css`
      position: fixed;
      width: 300px;
      height: 100%;
      background: ${decl.pageBackground};
      border-right: 2px solid ${colours.purple._200};
      padding: ${sizes._05};
    `)}>
      <h1 class={css`
        font-weight: 400;
        font-size: 32px;
        line-height: 32px;
      `}>
        Etch <span class={c(styles.ForceEmoji, cl.text.sm)}>✏️</span>
      </h1>
      <p>Hover: {hover}</p>
      <p>Last click: {click}</p>

      <div class={css`
        display: flex;
        align-items: center;
        font-size: 120%;
      `}>
        <ArrowButton obs={tileCountX}/>x
        <ArrowButton obs={tileCountY}/>@
        <ArrowButton obs={tileSizePx}/>px/tile
      </div>
      <Palette/>
      <ColourPicker/>
    </section>

    <section class={c(cl.vspace, css`
      padding: 20px;
      margin-left: 300px;
    `)}>
      <TilesCanvas/>
      <ClickButton text='Export as LZString' fn={() => lzDataText(data.tiles.lzData())}/>
      <pre class={c(cl.text.xs, css`
        background: ${colours.gray._200};
        padding: 10px;

        white-space: pre-wrap;
        word-wrap: anywhere;
      `)}>
        {lzDataText}
      </pre>
    </section>
  </main>;

const ws = new WebSocket(`ws://${window.location.host}`);
ws.addEventListener('message', ev => {
  const msg = ev.data as string;
  console.log('Websocket message', msg);
  if (msg === 'RELOAD') {
    const ok = window.confirm('Reload?');
    if (ok) window.location.reload();
  }
});

document.body.appendChild(<Page/>);
