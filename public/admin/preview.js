// Khung xem trước trong trang quản trị: hiện nội dung đang sửa theo đúng kiểu trình bày của web.
// Dùng API chính thức của Sveltia CMS: registerPreviewStyle + registerPreviewTemplate (React đi kèm CMS).
(() => {
  const CMS = window.CMS;
  if (!CMS) return;
  const h = CMS.React.createElement;
  CMS.registerPreviewStyle('/admin/preview.css');

  const KIND = { 'sang-tac': ['Tranh sáng tác', 'Personal work'], 'tranh-dat': ['Tranh đặt', 'Commissions'] };
  const get = (entry, key) => {
    const v = entry.getIn(['data', key]);
    return v && typeof v.toJS === 'function' ? v.toJS() : v;
  };
  const text = (v) => (v == null ? '' : String(v)).trim();
  const list = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean);
  const url = (getAsset, path) => {
    if (!path) return '';
    const a = getAsset(path);
    return a ? String(a.url || a) : '';
  };
  // "*chữ*" → <em>chữ</em>, sau khi đã thoát HTML (giống emphasize() ở src/lib/content.ts)
  const emph = (s) => ({
    __html: text(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*([^*]+)\*/g, '<em>$1</em>'),
  });
  const img = (src, alt, missing) => (src ? h('img', { src, alt }) : h('div', { className: 'empty' }, missing));
  // Khung nhìn chân dung giống web: object-position + phóng to quanh cùng điểm (src/components/Home.astro)
  const num = (v, min, max, d) => { const n = Number(v); return v === '' || v == null || !Number.isFinite(n) ? d : Math.min(max, Math.max(min, n)); };
  const focusStyle = (entry) => {
    const x = num(get(entry, 'chan_dung_ngang'), 0, 100, 50), y = num(get(entry, 'chan_dung_doc'), 0, 100, 50);
    const z = num(get(entry, 'chan_dung_phong_to'), 100, 300, 100) / 100;
    return { objectPosition: `${x}% ${y}%`, transformOrigin: `${x}% ${y}%`, scale: String(z) };
  };
  const sealLines = (s) => text(s || 'Bim').split('|').flatMap((p, i) => (i ? [h('br', { key: `b${i}` }), p.trim()] : [p.trim()]));

  /* ---------- Tác phẩm ---------- */
  function WorkPreview({ entry, getAsset }) {
    const title = text(get(entry, 'title_vi')) || 'Tên tranh';
    const kind = KIND[get(entry, 'loai')] || KIND['sang-tac'];
    const year = text(get(entry, 'nam'));
    const medium = text(get(entry, 'chat_lieu_vi'));
    const desc = text(get(entry, 'mo_ta_vi'));
    const client = text(get(entry, 'khach_hang'));
    const cover = url(getAsset, get(entry, 'anh_dai_dien'));
    const details = list(get(entry, 'anh_chi_tiet')).map((p) => url(getAsset, p));
    const total = (cover ? 1 : 0) + details.length;

    return h('div', { className: 'pv' },
      h('p', { className: 'hint' }, 'Xem trước: trên là thẻ trên con đường, dưới là trang chi tiết. Ảnh sẽ được tối ưu khi đăng lên web.'),
      h('p', { className: 'label' }, 'Trên con đường'),
      h('div', { className: 'card' },
        h('div', { className: 'media' }, img(cover, title, 'Chưa có ảnh đại diện'), total > 1 && h('span', { className: 'count' }, `${total} ảnh`)),
        h('span', { className: 'dot' }),
        h('div', { className: 'panel' },
          h('p', { className: 'label' }, kind[0]),
          h('h3', null, title),
          medium && h('span', { className: 'medium' }, medium),
          desc && h('p', { className: 'desc' }, desc.length > 220 ? `${desc.slice(0, 220)}…` : desc),
          h('span', { className: 'more' }, `Xem ${Math.max(total, 1)} ảnh →`))),
      h('hr', { className: 'sep' }),
      h('p', { className: 'label' }, `Trang chi tiết · ${kind[0]}${year ? ` · ${year}` : ''}`),
      h('div', { className: 'head' },
        h('div', null, h('h1', null, title), desc && h('p', { className: 'desc', style: { marginTop: 16 } }, desc)),
        h('dl', null,
          h('div', null, h('dt', null, 'Loại tranh'), h('dd', null, kind[0])),
          get(entry, 'loai') === 'tranh-dat' && client && h('div', null, h('dt', null, 'Khách đặt'), h('dd', null, client)),
          year && h('div', null, h('dt', null, 'Năm'), h('dd', null, year)),
          medium && h('div', null, h('dt', null, 'Chất liệu'), h('dd', null, medium)))),
      details.length > 0 && h('div', { className: 'gallery' },
        details.map((src, i) => h('figure', { key: i }, img(src, `${title} ${i + 2}`, 'Ảnh chưa tải xong'), h('figcaption', null, `${i + 2} / ${total}`)))),
      h('div', { className: 'en' },
        h('p', { className: 'label' }, `Bản tiếng Anh · ${kind[1]}`),
        h('h2', null, text(get(entry, 'title_en')) || title),
        text(get(entry, 'chat_lieu_en')) && h('span', { className: 'medium' }, text(get(entry, 'chat_lieu_en'))),
        h('p', { className: 'desc', style: { marginTop: 8 } }, text(get(entry, 'mo_ta_en')) || desc || '—')));
  }

  /* ---------- Giới thiệu & Liên hệ ---------- */
  function ProfilePreview({ entry, getAsset }) {
    const lines = text(get(entry, 'tieu_de_vi')).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    const paras = text(get(entry, 'gioi_thieu_vi')).split(/\r?\n\s*\r?\n/).map((s) => s.trim()).filter(Boolean);
    const portrait = url(getAsset, get(entry, 'anh_chan_dung'));
    const logo = url(getAsset, get(entry, 'logo'));
    const caption = text(get(entry, 'chu_thich_anh_vi'));
    const links = [
      ['Email', text(get(entry, 'email'))],
      ['Instagram', text(get(entry, 'instagram')).replace(/^https?:\/\/(www\.)?/, '')],
      ['Behance', text(get(entry, 'behance')).replace(/^https?:\/\/(www\.)?/, '')],
      ['Điện thoại', text(get(entry, 'dien_thoai'))],
    ].filter(([, v]) => v);

    return h('div', { className: 'pv' },
      h('p', { className: 'hint' }, `Xem trước đầu trang và phần Liên hệ (bản tiếng Việt). Tên trên thanh menu: ${text(get(entry, 'nghe_danh_vi'))} · ${text(get(entry, 'nghe_danh_en'))}`),
      h('div', { className: 'hero' },
        h('div', null,
          text(get(entry, 'nhan_doc_vi')) && h('p', { className: 'label', style: { color: 'var(--son)', marginBottom: 6 } }, `Chữ dọc ở lề: ${text(get(entry, 'nhan_doc_vi'))}`),
          text(get(entry, 'vai_tro_vi')) && h('p', { className: 'label' }, text(get(entry, 'vai_tro_vi'))),
          h('h1', null, (lines.length ? lines : ['Câu tuyên ngôn']).map((l, i) => h('span', { key: i, style: { display: 'block' }, dangerouslySetInnerHTML: emph(l) }))),
          h('div', { className: 'lead' }, paras.map((p, i) => h('p', { key: i }, p)))),
        h('figure', { style: { margin: 0 } },
          h('div', { className: 'portrait' }, h('div', { className: 'crop' }, portrait
            ? h('img', { src: portrait, alt: 'Chân dung', style: focusStyle(entry) })
            : h('div', { className: 'empty' }, 'Chưa có ảnh chân dung')), logo ? h('img', { className: 'logo-mark', src: logo, alt: '' }) : h('span', { className: 'seal' }, sealLines(get(entry, 'con_dau')))),
          caption && h('figcaption', { className: 'cap' }, caption))),
      h('div', { className: 'contact' },
        h('p', { className: 'label' }, 'Liên hệ'),
        h('h2', { dangerouslySetInnerHTML: emph(get(entry, 'cau_hoi_vi') || 'Câu mời liên hệ') }),
        text(get(entry, 'trang_thai_vi')) && h('span', { className: 'status' }, h('i'), text(get(entry, 'trang_thai_vi'))),
        h('ul', { className: 'links' }, links.map(([k, v]) => h('li', { key: k }, h('span', null, k), h('span', null, v))))));
  }

  CMS.registerPreviewTemplate('tac-pham', WorkPreview);
  CMS.registerPreviewTemplate('thong-tin', ProfilePreview);
})();
