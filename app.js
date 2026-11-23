/* Pengganti logika PHP: membaca parameter dari URL (?periode=...&rute=...) dan tanggal perangkat */
(function () {
  var q0 = new URLSearchParams(location.search);
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';

  var DEF = {
    index: { wilayah: '' },
    ricek_realisasi: { wilayah: 'ALL' },
    headway: { rute: 'JAK80' },
    kesesuaian: { rute: 'JAK1' },
    validasi_trip: { rute: 'JAK1' },
    cari_bus: { nomor_bus: 'BDL-075' },
    manual_do: { rute: 'JAK1', petugas: '107030' },
    update_trip: { rute: 'JAK1' },
    update_lokasi: { rute: 'JAK1' },
    sebaran: { rute: 'JAK07' },
    list_petugas: { nik: '' },
    list_operator: { operator: 'KOPERASI WAHANA KALPIKA' }
  };
  var d = DEF[page] || {};
  var q = {};
  ['rute', 'wilayah', 'nomor_bus', 'operator', 'nik', 'petugas'].forEach(function (k) {
    var v = q0.get(k);
    q[k] = v !== null ? v : (d[k] !== undefined ? d[k] : '');
  });

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var now = new Date();
  var iso = q0.get('periode') || (now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()));
  var p = iso.split('-');
  var dmy = p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;

  // Hari kerja (weekDay) vs akhir pekan / libur nasional tetap (weekEnd)
  var dt = new Date(iso + 'T00:00:00');
  var dow = dt.getDay(); // 0 = Minggu, 6 = Sabtu
  var md = p.length === 3 ? p[1] + '-' + p[2] : '';
  var dayweek = (dow === 0 || dow === 6 || ['01-01', '05-01', '06-01', '08-17', '12-25'].indexOf(md) > -1) ? 'weekEnd' : 'weekDay';

  var MAP = {
    '2000-01-04': iso, '04/01/2000': dmy,
    'ZZRUTEZZ': q.rute, 'ZZWILZZ': q.wilayah, 'ZZBUSZZ': q.nomor_bus,
    'ZZOPRZZ': q.operator, 'ZZNIKZZ': q.nik, 'ZZPTGZZ': q.petugas, 'ZZDAYWEEKZZ': dayweek
  };
  var RE = /2000-01-04|04\/01\/2000|ZZ(?:RUTE|WIL|BUS|OPR|NIK|PTG|DAYWEEK)ZZ/g;
  function sub(str) { return str.replace(RE, function (m) { return MAP[m]; }); }

  function apply() {
    // 1. teks
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var t = n.parentNode && n.parentNode.nodeName;
        if (t === 'SCRIPT' || t === 'STYLE') return NodeFilter.FILTER_REJECT;
        return RE.test(n.nodeValue) && !(RE.lastIndex = 0) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var nodes = [], n;
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      if (node.nodeValue.indexOf('ZZDAYWEEKZZ') > -1 && dayweek === 'weekEnd' && node.parentElement) {
        node.parentElement.classList.remove('text-slate-400');
        node.parentElement.classList.add('text-amber-400', 'font-semibold');
      }
      node.nodeValue = sub(node.nodeValue);
    });

    // 2. atribut (value, title, onclick, dll.)
    document.querySelectorAll('body *').forEach(function (el) {
      if (el.nodeName === 'SCRIPT') return;
      for (var i = 0; i < el.attributes.length; i++) {
        var a = el.attributes[i];
        RE.lastIndex = 0;
        if (RE.test(a.value)) { RE.lastIndex = 0; el.setAttribute(a.name, sub(a.value)); }
      }
      RE.lastIndex = 0;
    });

    // 3. isi ulang nilai filter (pengganti atribut "selected" dari PHP)
    document.querySelectorAll('select[name], input[name]').forEach(function (el) {
      var k = el.getAttribute('name');
      if (k === 'periode') { el.value = iso; return; }
      if (!(k in q)) return;
      if (el.nodeName === 'SELECT') {
        var ok = Array.prototype.some.call(el.options, function (o) { return o.value === q[k]; });
        if (ok) el.value = q[k];
      } else if (!el.value || /^ZZ/.test(el.value)) {
        el.value = q[k];
      }
    });
  }

  window.__P = { q: q, iso: iso, dmy: dmy, dayweek: dayweek, apply: apply };
})();
