const ROUTES = [
  {
    d: 'M 84 518 C 258 316 444 294 610 382 S 908 552 1122 302',
    duration: '13s',
    delay: '-2s',
    secondary: false,
  },
  {
    d: 'M 236 154 C 454 170 568 332 754 408 S 1012 488 1152 620',
    duration: '16s',
    delay: '-8s',
    secondary: true,
  },
  {
    d: 'M 444 674 C 590 548 650 446 728 348 S 900 202 1068 244',
    duration: '14.5s',
    delay: '-5s',
    secondary: true,
  },
  {
    d: 'M 610 392 C 708 222 864 184 1018 278',
    duration: '10.5s',
    delay: '-4s',
    secondary: false,
  },
];

const NODES = [
  [178, 442],
  [476, 322],
  [610, 382],
  [724, 348],
  [820, 214],
  [926, 438],
  [1018, 278],
  [1090, 326],
];

export default function NetworkGlobeBackground() {
  return <div className="network-globe-background" aria-hidden="true">
    <div className="network-globe__aurora" />
    <svg className="network-globe__svg" viewBox="0 0 1200 800" fill="none" focusable="false" preserveAspectRatio="xMidYMid meet">
      <g className="network-globe__sphere">
        <circle cx="820" cy="360" r="250" />
        <ellipse cx="820" cy="360" rx="250" ry="86" />
        <ellipse cx="820" cy="360" rx="250" ry="164" />
        <ellipse cx="820" cy="360" rx="86" ry="250" />
        <ellipse cx="820" cy="360" rx="164" ry="250" />
        <ellipse cx="820" cy="360" rx="108" ry="250" transform="rotate(34 820 360)" />
        <ellipse cx="820" cy="360" rx="108" ry="250" transform="rotate(-34 820 360)" />
      </g>

      <g className="network-globe__routes">
        {ROUTES.map((route, index) => <g key={route.d} className={route.secondary ? 'network-globe__route--secondary' : undefined}>
          <path d={route.d} className="network-globe__route" />
          <path
            d={route.d}
            pathLength="100"
            className="network-globe__flow"
            style={{ '--network-flow-duration': route.duration, '--network-flow-delay': route.delay }}
          />
        </g>)}
      </g>

      <g className="network-globe__nodes">
        {NODES.map(([cx, cy]) => <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
          <circle r="8" className="network-globe__node-ring" />
          <circle r="2.25" className="network-globe__node" />
        </g>)}
      </g>
    </svg>
  </div>;
}
