# Genre Filter and Film Credits

Status: ready-for-agent

## Summary

Sederhanakan discovery landing menjadi satu movie rail dengan filter chips. Default menampilkan film sedang tayang; memilih genre mengganti isi rail yang sama. Tambahkan informasi director dan delapan aktor utama beserta foto pada halaman detail film.

## Settled decisions

- Satu section movie rail, bukan satu section per genre.
- Default: Sedang Tayang.
- Filter: chips untuk Action, Drama, Comedy, Horror, dan Animation.
- Film genre tetap berasal dari TMDB Discover.
- Detail menampilkan satu director dan maksimal delapan aktor utama.
- Setiap aktor menampilkan foto, nama, dan nama karakter.
- Missing profile image memakai fallback visual yang rapi.
- Verifikasi: lint, build, dan browser smoke jika tersedia; tidak menambah test runner.

## Landing requirements

- Filter aktif memiliki state visual, `aria-pressed`, dan label yang jelas.
- Mengganti filter tidak berpindah route atau mengubah scroll halaman secara tiba-tiba.
- Rail yang sama diperbarui dengan film genre terpilih.
- Loading genre menampilkan skeleton di rail, bukan mengganti seluruh halaman.
- Error genre menampilkan retry dan pilihan filter lain tetap dapat digunakan.
- Default now-playing memakai query yang sudah tersedia tanpa request tambahan.
- Reduced motion tidak memakai transisi posisi yang berlebihan.

## Credits data requirements

- TMDB detail request tetap memakai `append_to_response=credits`.
- Credits typing mencakup crew profile path serta cast: id, name, character, profile path, order.
- Domain Movie menyimpan director sebagai object yang mendukung nama dan foto serta cast list.
- Director dipilih dari crew dengan job `Director`.
- Cast diurutkan berdasarkan order dan dibatasi delapan.
- Profile URL menggunakan TMDB image base; null dipertahankan untuk fallback UI.

## Detail UI requirements

- Section credits memiliki heading jelas setelah synopsis/media context.
- Director tampil lebih menonjol dari cast.
- Cast ditampilkan dalam responsive horizontal rail atau grid yang tetap mudah digunakan di mobile.
- Foto memakai aspect portrait konsisten, meaningful alt text, dan lazy loading.
- Missing photo memakai initial/name fallback, bukan broken image.
- Nama dan karakter tidak bergantung pada hover.

## Seam verification

1. `npm run typecheck` selama implementasi.
2. `npm run lint`.
3. `npm run build`.
4. Browser smoke 1440px dan 390px jika tooling tersedia.
5. Catat blocker dan jangan mengklaim validasi visual jika browser tidak tersedia.
