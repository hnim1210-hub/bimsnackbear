// Con đường tác phẩm: đường cong liền mạch đi qua giữa từng tác phẩm, tự vẽ dần khi cuộn,
// máy bay giấy ở đầu mút, điểm đỏ bật lên khi nét vẽ tới. Kèm bộ lọc loại tranh và hiệu ứng hiện ảnh.
const SVG = 'http://www.w3.org/2000/svg';

export function initTrail() {
  const trail = document.getElementById('trail');
  const rows = document.getElementById('rows');
  if (!trail || !rows) return;
  const ghost = trail.querySelector<SVGPathElement>('.ghost')!;
  const draw = trail.querySelector<SVGPathElement>('.draw')!;
  const stopsG = trail.querySelector<SVGGElement>('.stops')!;
  const plane = trail.querySelector<SVGGElement>('.plane')!;
  const end = document.getElementById('trail-end')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 760px)');
  let len = 0;
  let ticking = false;
  let stops: { c: SVGCircleElement; y: number }[] = [];

  /* Mỗi khúc là một đường Bézier; tại mỗi tác phẩm đường nghiêng cùng một góc rồi đổi hướng trái/phải.
     Tay nắm = 1/3 chiều dài đoạn → đoạn ngắn uốn ít, đoạn dài uốn nhiều, cả đường cùng một nhịp. */
  function smooth(A: number[][], h: number) {
    let d = `M${A[0][0].toFixed(1)} ${A[0][1].toFixed(1)}`;
    for (let i = 0; i < A.length - 1; i++) {
      const [x0, y0] = A[i], [x1, y1] = A[i + 1], k = (y1 - y0) / 3, s0 = i % 2 ? -1 : 1, s1 = -s0;
      d += ` C${(x0 + s0 * h * k).toFixed(1)} ${(y0 + k).toFixed(1)} ${(x1 - s1 * h * k).toFixed(1)} ${(y1 - k).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    return d;
  }

  function build() {
    const tr = trail!.getBoundingClientRect();
    const h = narrow.matches ? 0.05 : 0.2;
    const pts = [...rows!.querySelectorAll<HTMLElement>('.row:not([hidden]) .node')].map((n) => {
      const r = n.getBoundingClientRect();
      return [r.left + r.width / 2 - tr.left, r.top + r.height / 2 - tr.top];
    });
    stopsG.replaceChildren();
    stops = [];
    if (!pts.length) { ghost.setAttribute('d', ''); draw.setAttribute('d', ''); plane.style.display = 'none'; len = 0; return; }
    const P = [[pts[0][0], 0], ...pts, [pts[pts.length - 1][0], end.offsetTop + 6]];
    const d = smooth(P, h);
    ghost.setAttribute('d', d);
    draw.setAttribute('d', d);
    stops = pts.map(([x, y]) => {
      const c = document.createElementNS(SVG, 'circle');
      c.setAttribute('class', 'stop');
      c.setAttribute('cx', String(x));
      c.setAttribute('cy', String(y));
      c.setAttribute('r', narrow.matches ? '5' : '6');
      stopsG.append(c);
      return { c, y };
    });
    len = draw.getTotalLength();
    draw.style.strokeDasharray = String(len);
    update();
  }

  function update() {
    ticking = false;
    if (!len) return;
    if (reduce.matches) {
      draw.style.strokeDashoffset = '0';
      plane.style.display = 'none';
      stops.forEach((s) => s.c.classList.add('on'));
      return;
    }
    const r = trail!.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    draw.style.strokeDashoffset = String(len * (1 - p));
    const L = len * p;
    const pt = draw.getPointAtLength(L);
    const a = draw.getPointAtLength(Math.max(0, L - 4));
    const b = draw.getPointAtLength(Math.min(len, Math.max(L, 4)));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    plane.style.display = '';
    plane.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    stops.forEach((s) => {
      const on = pt.y >= s.y - 1;
      if (on !== s.c.classList.contains('on')) s.c.classList.toggle('on', on);
    });
  }

  // Hiện ảnh/chữ khi cuộn tới (nét cọ loang)
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io!.unobserve(e.target); }
      }), { rootMargin: '0px 0px -15% 0px' })
    : null;
  rows.querySelectorAll('.row').forEach((r) => (io ? io.observe(r) : r.classList.add('in')));

  // Bộ lọc: Tất cả / Tranh sáng tác / Tranh đặt
  const chips = document.querySelectorAll<HTMLButtonElement>('.chip[data-kind]');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const k = chip.dataset.kind;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    rows!.querySelectorAll<HTMLElement>('.row').forEach((row) => {
      row.hidden = k !== 'all' && row.dataset.kind !== k;
    });
    requestAnimationFrame(build);
  }));

  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  new ResizeObserver(() => requestAnimationFrame(build)).observe(trail);
  document.fonts?.ready.then(build);
  build();
}
