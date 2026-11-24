// Nút "Chép email": chép vào bộ nhớ tạm, nếu trình duyệt không cho thì bôi đen để người xem tự chép.
export function initCopy() {
  const btn = document.getElementById('copy') as HTMLButtonElement | null;
  const email = document.getElementById('email');
  if (!btn || !email) return;
  let timer: number | undefined;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email.textContent?.trim() ?? '');
      btn.textContent = btn.dataset.copied ?? '';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(email);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      btn.textContent = btn.dataset.selected ?? '';
    }
    clearTimeout(timer);
    timer = window.setTimeout(() => (btn.textContent = btn.dataset.copy ?? ''), 2000);
  });
}
