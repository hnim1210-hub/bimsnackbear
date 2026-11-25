// Rê chuột vào ảnh đại diện trên con đường: khoảng 1 giây sau tự chuyển lần lượt qua các ảnh khác
// của tác phẩm (lặp lại); bỏ chuột ra thì về ảnh đại diện. Chỉ trên thiết bị có chuột.
// Ảnh kế tiếp chỉ tải khi rê chuột vào lần đầu (đường dẫn nằm trong data-slides của thẻ .media).
const DELAY = 1000; // ms giữa hai lần chuyển ảnh

export function initHoverSlides() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll<HTMLElement>('.media[data-slides]').forEach((media) => {
    const urls: string[] = JSON.parse(media.dataset.slides || '[]');
    if (!urls.length) return;
    const count = media.querySelector<HTMLElement>('.count');
    const countText = count?.textContent ?? '';
    const total = urls.length + 1;
    let layer: HTMLImageElement | null = null;
    let timer: number | undefined;
    let index = 0; // 0 = ảnh đại diện, 1..n = urls[i-1]

    const show = (i: number) => {
      index = i;
      if (count) count.textContent = i === 0 ? countText : `${i + 1} / ${total}`;
      if (i === 0) { layer?.classList.remove('on'); return; }
      if (!layer) {
        layer = document.createElement('img');
        layer.className = 'slide';
        layer.alt = '';
        layer.decoding = 'async';
        media.append(layer);
      }
      const next = new Image();
      next.onload = () => {
        if (index !== i || !layer) return; // đã rời chuột hoặc đã chuyển tiếp
        layer.src = urls[i - 1];
        layer.classList.add('on');
      };
      next.src = urls[i - 1];
      // tải trước ảnh sau nữa cho lần chuyển kế tiếp
      if (i < urls.length) new Image().src = urls[i];
    };

    const step = () => {
      show(index >= urls.length ? 0 : index + 1);
      timer = window.setTimeout(step, DELAY);
    };

    media.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      new Image().src = urls[0]; // bắt đầu tải ảnh thứ hai ngay
      timer = window.setTimeout(step, DELAY);
    });
    media.addEventListener('mouseleave', () => {
      clearTimeout(timer);
      show(0);
    });
  });
}
