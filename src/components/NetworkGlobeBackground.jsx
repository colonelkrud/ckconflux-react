const HOMESERVERS = [
  { id: 'hs-a', x: 382, y: 246, secondary: false, users: [[318, 198], [312, 284], [416, 184]] },
  { id: 'hs-b', x: 590, y: 168, secondary: false, users: [[538, 112], [614, 102], [654, 150]] },
  { id: 'hs-c', x: 806, y: 226, secondary: false, users: [[790, 152], [866, 176], [874, 246]] },
  { id: 'hs-d', x: 1010, y: 350, secondary: false, users: [[1046, 288], [1082, 354], [1048, 414]] },
  { id: 'hs-e', x: 892, y: 548, secondary: false, users: [[954, 516], [952, 586], [866, 620]] },
  { id: 'hs-f', x: 650, y: 602, secondary: false, users: [[604, 664], [680, 674], [716, 620]] },
  { id: 'hs-g', x: 440, y: 514, secondary: true, users: [[366, 510], [390, 574], [470, 588]] },
  { id: 'hs-h', x: 684, y: 382, secondary: true, users: [[622, 342], [708, 314], [742, 410]] },
];

const FEDERATION_LINKS = [
  { d: 'M 382 246 Q 478 176 590 168', duration: '12s', delay: '-2s', reverse: false, secondary: false },
  { d: 'M 590 168 Q 700 154 806 226', duration: '15s', delay: '-7s', reverse: true, secondary: false },
  { d: 'M 806 226 Q 930 244 1010 350', duration: '13s', delay: '-5s', reverse: false, secondary: false },
  { d: 'M 1010 350 Q 1028 470 892 548', duration: '16s', delay: '-9s', reverse: true, secondary: false },
  { d: 'M 892 548 Q 774 624 650 602', duration: '14s', delay: '-4s', reverse: false, secondary: false },
  { d: 'M 650 602 Q 530 624 440 514', duration: '17s', delay: '-11s', reverse: true, secondary: true },
  { d: 'M 440 514 Q 328 394 382 246', duration: '15s', delay: '-6s', reverse: false, secondary: true },
  { d: 'M 382 246 Q 566 238 806 226', duration: '18s', delay: '-13s', reverse: true, secondary: false },
  { d: 'M 590 168 Q 646 280 684 382', duration: '11s', delay: '-3s', reverse: false, secondary: true },
  { d: 'M 806 226 Q 744 312 684 382', duration: '12.5s', delay: '-8s', reverse: true, secondary: true },
  { d: 'M 1010 350 Q 840 394 684 382', duration: '17s', delay: '-10s', reverse: false, secondary: true },
  { d: 'M 892 548 Q 790 432 684 382', duration: '14.5s', delay: '-1s', reverse: true, secondary: true },
  { d: 'M 440 514 Q 564 438 684 382', duration: '16.5s', delay: '-12s', reverse: false, secondary: true },
];

export default function NetworkGlobeBackground() {
  return <div className="network-globe-background" aria-hidden="true">
    <div className="network-globe__aurora" />
    <svg className="network-globe__svg" viewBox="0 0 1200 800" fill="none" focusable="false" preserveAspectRatio="xMidYMid meet">
      <g className="network-globe__sphere">
        <circle cx="700" cy="390" r="326" />
        <ellipse cx="700" cy="390" rx="326" ry="112" />
        <ellipse cx="700" cy="390" rx="326" ry="220" />
        <ellipse cx="700" cy="390" rx="118" ry="326" />
        <ellipse cx="700" cy="390" rx="228" ry="326" />
        <ellipse cx="700" cy="390" rx="144" ry="326" transform="rotate(35 700 390)" />
        <ellipse cx="700" cy="390" rx="144" ry="326" transform="rotate(-35 700 390)" />
      </g>

      <g className="network-globe__federation">
        {FEDERATION_LINKS.map((link) => <g key={link.d} className={link.secondary ? 'network-globe__federation--secondary' : undefined}>
          <path d={link.d} className="network-globe__route" />
          <path
            d={link.d}
            pathLength="100"
            className={`network-globe__flow ${link.reverse ? 'network-globe__flow--reverse' : ''}`}
            style={{ '--network-flow-duration': link.duration, '--network-flow-delay': link.delay }}
          />
        </g>)}
      </g>

      <g className="network-globe__servers">
        {HOMESERVERS.map((server, serverIndex) => <g
          key={server.id}
          className={`network-globe__server ${server.secondary ? 'network-globe__server--secondary' : ''}`}
        >
          <g className="network-globe__client-links">
            {server.users.map(([userX, userY], userIndex) => <g key={`${server.id}-user-${userIndex}`}>
              <line x1={server.x} y1={server.y} x2={userX} y2={userY} className="network-globe__client-link" />
              {userIndex === 0 && <line
                x1={server.x}
                y1={server.y}
                x2={userX}
                y2={userY}
                pathLength="100"
                className={`network-globe__client-flow ${(serverIndex + userIndex) % 2 ? 'network-globe__flow--reverse' : ''}`}
                style={{
                  '--network-flow-duration': `${9 + serverIndex * 0.8}s`,
                  '--network-flow-delay': `${-1.5 * serverIndex}s`,
                }}
              />}
            </g>)}
          </g>

          <g transform={`translate(${server.x} ${server.y})`} className="network-globe__homeserver">
            <circle r="12" className="network-globe__homeserver-ring" />
            <circle r="4" className="network-globe__homeserver-core" />
          </g>

          <g className="network-globe__users">
            {server.users.map(([userX, userY], userIndex) => <g key={`${server.id}-node-${userIndex}`} transform={`translate(${userX} ${userY})`}>
              <circle r="4.25" className="network-globe__user-ring" />
              <circle r="1.7" className="network-globe__user-node" />
            </g>)}
          </g>
        </g>)}
      </g>
    </svg>
  </div>;
}
