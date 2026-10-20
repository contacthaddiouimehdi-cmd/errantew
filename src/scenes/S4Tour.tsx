import React from 'react';
import {useCurrentFrame} from 'remotion';
import {copy, tx} from '../copy';
import {factRun} from '../components/CountUp';
import {triptychX} from '../components/Panels';
import {ChapterTile, NameSuper} from '../components/Supers';
import {styles, TileStack} from '../components/Tile';
import {TourRoute} from '../components/TourRoute';
import {draw, line, Pt, Thread, through} from '../components/Thread';
import {layout as L} from '../tokens';
import {Line, SceneProps, Shot, Y_CENTRE} from './common';

// f1300–1775 (475) · Season 2, on tour. The music switches to full groove; beats on local 5 + 15n.
// Triptych → the thread runs like a road (line 14) → one word per panel → the thread
// traces the route, 7 stops on 7 beats → Mehdi El Amri, the thread follows the ball.

// Juggling path over the Mehdi panel (stand-in until the ball is keyframed on the real shot).
const BALL: Pt[] = through(
  [[310, 1000], [380, 560], [450, 900], [530, 430], [610, 860], [690, 380], [770, 820], [820, 300]],
  20,
);

export const S4Tour: React.FC<SceneProps> = ({lang}) => {
  const f = useCurrentFrame();
  const words = copy.s4.words;
  const roadDraw = draw(f, 110, 15);
  const reach = [230, 245, 260, 275, 290, 305, 320];
  const ballHead = draw(f, 368, 100);
  return (
    <>
      {/* Triptych with the chapter and line 13; cuts on the beat. */}
      {(['s4-crowd', 's4-stage', 's4-football'] as const).map((id, i) => (
        <React.Fragment key={id}>
          <Shot id={id} from={0} dur={65} x={triptychX[i]} />
          <Shot id={`${id}-2`} from={65} dur={45} x={triptychX[i]} />
        </React.Fragment>
      ))}
      <ChapterTile text={copy.s4.chapter[lang]} lang={lang} at={5} out={50} />
      <Line t={copy.s4.l13} lang={lang} at={50} out={110} exit="cut" y={160} />

      {/* Line 14 on black: the thread runs like a road. */}
      {f >= 110 && f < 170 ? <Thread paths={[line([0, 700], [1920, 700])]} to={roadDraw} dash={[90, 45]} dashOffset={(f - 110) * 22} head={false} /> : null}
      <Line t={copy.s4.l14} lang={lang} at={113} out={170} exit="cut" y={Y_CENTRE - 60} />

      {/* One word per panel, cut in 6 frames apart. */}
      {(['s4-word-football', 's4-word-music', 's4-word-gaming'] as const).map((id, i) => (
        <Shot key={id} id={id} from={170} dur={45} x={triptychX[i]} />
      ))}
      {words.map((w, i) => (
        <TileStack
          key={i}
          x={triptychX[i] + L.panel.w / 2}
          y={880}
          align="center"
          items={[{runs: tx(w, lang), style: styles.super('white', 'black'), anim: {at: 170 + i * 6, out: 215, enter: 'cut', exit: 'cut'}}]}
        />
      ))}

      {/* The route: 7 stops on 7 beats, over dim tour footage. No map. */}
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <Shot id={`s4-tour-${i + 1}`} from={215} dur={75} x={triptychX[i]} opacity={L.routeBackdrop} />
          <Shot id={`s4-tour-${i + 4}`} from={290} dur={75} x={triptychX[i]} opacity={L.routeBackdrop} />
        </React.Fragment>
      ))}
      <TourRoute lang={lang} reach={reach} y={470} out={365} />
      <Line t={copy.s4.l15} lang={lang} at={320} out={365} exit="cut" style={styles.super('orange', 'white')} y={900} />

      {/* Mehdi El Amri: signature moment, the thread follows the ball. */}
      <Shot id="s4-mehdi" from={365} dur={110} x={240} />
      {f >= 368 ? <Thread paths={[BALL]} from={Math.max(0, ballHead - 0.3)} to={ballHead} /> : null}
      <NameSuper name={[factRun('MEHDI_AMRI_NAME', lang, f, 0)]} fn={tx(copy.s4.fn, lang)} at={372} out={475} x={960} y={880} />
      <Line t={copy.s4.l16} lang={lang} at={410} out={475} exit="cut" x={960} y={420} align="left" maxWidth={864} />
    </>
  );
};
