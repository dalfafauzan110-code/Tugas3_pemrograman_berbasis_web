Vue.filter('uppercase', function (value) {
  if (!value) return '';
  return value.toString().toUpperCase();
});

new Vue({
  el: '#app',
  data: {
    tab: 'tracking',
    upbjjlist: [],
    kategorilist: [],
    pengirimanlist: [],
    paketList: [
      { nama: 'PAKET IPS Dasar', harga: 120000 },
      { nama: 'PAKET IPA Dasar', harga: 140000 }
    ],
    stok: [],
    tracking: [
      {
        "DO2025-0001": {
          "nim": "123456789",
          "nama": "Rina Wulandari",
          "status": "Dalam Perjalanan",
          "ekspedisi": "JNE",
          "tanggalKirim": "2025-08-25",
          "paket": "PAKET-UT-001",
          "total": 120000,
          "perjalanan": [
            {
              "waktu": "2025-08-25 10:12:20",
              "keterangan": "Penerimaan di Loket: TANGSEL"
            }
          ]
        }
      },
      {
        "DO2025-0002": {
          "nim": "123456789",
          "nama": "Rina Wulandari",
          "status": "Dalam Perjalanan",
          "ekspedisi": "JNE",
          "tanggalKirim": "2025-08-25",
          "paket": "PAKET-UT-001",
          "total": 120000,
          "perjalanan": [
            {
              "waktu": "2025-08-25 10:12:20",
              "keterangan": "Penerimaan di Loket: TANGSEL"
            }
          ]
        }
      }
    ]
  },
  async created() {
    const data = await ApiService.fetchData();
    if (data) {
      this.upbjjlist = data.upbjjList || data.upbjjlist || [];
      this.kategorilist = data.kategoriList || data.kategorilist || [];
      this.pengirimanlist = data.pengirimanList || data.pengirimanlist || [];
      if (data.paket && data.paket.length > 0) this.paketList = data.paket;
      this.stok = data.stok || [];
    }
  },
  methods: {
    handleAddItem(newItem) {
      this.stok.push(newItem);
    },
    handleUpdateItem({ index, data }) {
      Vue.set(this.stok, index, data);
    },
    handleRequestDelete(kode) {
      const index = this.stok.findIndex(item => item.kode === kode);
      if (index !== -1) {
        this.$refs.modal.open(
          'Konfirmasi Hapus',
          `Apakah Anda yakin ingin menghapus data "${this.stok[index].judul}"?`,
          () => { this.stok.splice(index, 1); }
        );
      }
    },
    handleaddOrder(newDO) {
      this.tracking.push(newDO);
    },
    handleaddProgress({ noDO, progress }) {
      const targetObj = this.tracking.find(t => t[noDO]);
      if (targetObj) {
        targetObj[noDO].perjalanan.push(progress);
      }
    }
  }
});