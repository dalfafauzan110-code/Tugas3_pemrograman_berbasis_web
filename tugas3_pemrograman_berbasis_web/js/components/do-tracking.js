Vue.component('do-tracking', {
  template: '#tpl-do-tracking',
  props: {
    trackingList: { type: Array, required: true },
    paketList: { 
      type: Array, 
      default: () => [
        { nama: 'PAKET IPS Dasar', harga: 120000 },
        { nama: 'PAKET IPA Dasar', harga: 140000 }
      ] 
    }
  },
  data() {
    return {
      searchQuery: '',
      formDO: {
        nim: '',
        nama: '',
        paket: '',
        harga: 0
      }
    };
  },
  computed: {
    actualPaketList() {
      if (this.paketList && this.paketList.length > 0) return this.paketList;
      return [
        { nama: 'PAKET IPS Dasar', harga: 120000 },
        { nama: 'PAKET IPA Dasar', harga: 140000 }
      ];
    },
    filteredTracking() {
      if (!this.trackingList) return [];
      return this.trackingList.filter(item => {
        const noDO = Object.keys(item)[0] || '';
        const data = item[noDO] || {};
        const q = this.searchQuery.toLowerCase();
        return noDO.toLowerCase().includes(q) || 
               String(data.nim || '').toLowerCase().includes(q) || 
               String(data.nama || '').toLowerCase().includes(q);
      });
    }
  },
  watch: {
    'formDO.paket'(newVal) {
      const found = this.actualPaketList.find(p => (typeof p === 'object' ? p.nama === newVal : p === newVal));
      if (found && typeof found === 'object') {
        this.formDO.harga = found.harga;
      } else if (newVal && newVal.includes('IPS')) {
        this.formDO.harga = 120000;
      } else if (newVal && newVal.includes('IPA')) {
        this.formDO.harga = 140000;
      } else {
        this.formDO.harga = 0;
      }
    }
  },
  methods: {
    formatCurrency(val) { return 'Rp ' + Number(val || 0).toLocaleString('id-ID'); },
    generateDONumber() {
      const currentYear = 2025;
      let maxNumber = 0;

      if (this.trackingList && this.trackingList.length > 0) {
        for (let item of this.trackingList) {
          const keys = Object.keys(item);
          if (keys.length > 0) {
            const doCode = keys[0]; 
            const parts = doCode.split('-');
            if (parts.length === 2) {
              const yearPart = parts[0]; 
              const numPart = parseInt(parts[1], 10);
              
              // Cari nomor tertinggi khusus pada tahun berjalan
              if (yearPart === `DO${currentYear}` && !isNaN(numPart)) {
                if (numPart > maxNumber) {
                  maxNumber = numPart;
                }
              }
            }
          }
        }
      }

      const nextNumber = maxNumber + 1;
      const paddedNum = String(nextNumber).padStart(4, '0');
      return `DO${currentYear}-${paddedNum}`;
    },
    submitDO() {
      if (!this.formDO.nim || !this.formDO.nama || !this.formDO.paket) {
        alert('Mohon lengkapi NIM, Nama, dan Paket!');
        return;
      }
      const doNumber = this.generateDONumber();
      const newDO = {
        [doNumber]: {
          nim: this.formDO.nim,
          nama: this.formDO.nama,
          status: 'Diproses',
          ekspedisi: 'JNE',
          tanggalKirim: new Date().toISOString().slice(0, 10), // Menggunakan 'tanggalKirim' dengan K besar
          paket: this.formDO.paket,
          total: this.formDO.harga,
          perjalanan: [
            {
              waktu: new Date().toISOString().slice(0, 19).replace('T', ' '),
              keterangan: 'Penerimaan di Loket: TANGSEL'
            }
          ]
        }
      };
      this.$emit('add-order', newDO);
      alert('DO berhasil dibuat');
      this.formDO = { nim: '', nama: '', paket: '', harga: 0 };
    }
  }
});