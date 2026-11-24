// Xem ảnh lớn trên trang chi tiết: bấm ảnh để mở, ←/→ hoặc vuốt để chuyển, Esc để đóng.
export function initLightbox() {
  const lb = document.getElementById('lb');
  const triggers = [...document.querySelectorAll<HTMLElement>('[data-full]')];
  if (!lb || !triggers.length) return;
  const img = lb.querySelector('img')!;
  const counter = lb.querySelector('[data-counter]')!;
  let index = 0;

  const show = (i: number) => {
    index = (i + triggers.length) % triggers.length;
    const t = triggers[index];
    img.src = t.dataset.full!;
    img.alt = t.dataset.alt ?? '';
    counter.textContent = `${index + 1} / ${triggers.length}`;
  };
  const open = (i: number) => {
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector<HTMLButtonElement>('[data-close]')!.focus();
  };
  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = '';
    triggers[index]?.focus();
  };

  triggers.forEach((t, i) => t.addEventListener('click', () => open(i)));
  lb.querySelector('[data-close]')!.addEventListener('click', close);
  lb.querySelector('[data-prev]')!.addEventListener('click', () => show(index - 1));
  lb.querySelector('[data-next]')!.addEventListener('click', () => show(index + 1));
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
  // Vuốt trái/phải trên điện thoại
  let x0: number | null = null;
  lb.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}
