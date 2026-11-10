Vue.component('order-form', {
  template: '#tpl-order',
  props: {
    paketList: { 
      type: Array, 
      default: () => [
        { nama: 'PAKET IPS Dasar', harga: 120000 },
        { nama: 'PAKET IPA Dasar', harga: 140000}
      ] 
    },
    pengirimanList: { 
      type: Array, 
      default: () => ['Reguler (3-5 hari)', 'Ekspres (1-2 hari)'] 
    }
  },
  data() {
    return {
      formOrder: {
        nim: '',
        nama: '',
        ekspedisi: '',
        tanggalkirim: '',
        paket: ''
      }
    };
  },
  watch: {
    'formOrder.nim'(newVal) {
      if (newVal && !this.formOrder.tanggalkirim) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        this.formOrder.tanggalkirim = `${yyyy}-${mm}-${dd}`;
      }
    }
  },
  computed: {
    actualPaketList() {
      if (this.paketList && this.paketList.length > 0) return this.paketList;
      return [
        { nama: 'PAKET IPS Dasar', harga: 120000 },
        { nama: 'PAKET IPA Dasar', harga: 140000}
      ];
    },
    actualPengirimanList() {
      if (this.pengirimanList && this.pengirimanList.length > 0) return this.pengirimanList;
      return ['Reguler (3-5 hari)', 'Ekspres (1-2 hari)'];
    },
    selectedPaketDetail() {
      if (!this.formOrder.paket) return null;
      const found = this.actualPaketList.find(p => {
        const pName = typeof p === 'object' ? p.nama : p;
        return pName === this.formOrder.paket;
      });
      if (found && typeof found === 'object') return found;
      if (this.formOrder.paket.includes('IPS')) return { nama: this.formOrder.paket, harga: 120000 };
      if (this.formOrder.paket.includes('IPA')) return { nama: this.formOrder.paket, harga: 140000 };
      return { nama: this.formOrder.paket, harga: 100000 };
    }
  },
  methods: {
    formatCurrency(val) { return 'Rp ' + Number(val || 0).toLocaleString('id-ID'); },
    generateDONumber() {
      const year = new Date().getFullYear();
      const count = Math.floor(Math.random() * 900) + 100;
      return `DOS-${year}-${count}`;
    },
    submitOrder() {
      if (!this.formOrder.nim || !this.formOrder.nama || !this.formOrder.paket || !this.formOrder.ekspedisi) {
        alert('Mohon lengkapi NIM, Nama, Paket, dan Pengiriman!');
        return;
      }
      const paketNama = this.formOrder.paket;
      const paketHarga = this.selectedPaketDetail ? this.selectedPaketDetail.harga : 0;

      const newDO = {
        [this.generateDONumber()]: {
          nim: this.formOrder.nim,
          nama: this.formOrder.nama,
          status: 'Diproses',
          ekspedisi: this.formOrder.ekspedisi,
          tanggalkirim: this.formOrder.tanggalkirim,
          paket: paketNama,
          total: paketHarga,
          perjalanan: [
            {
              waktu: new Date().toISOString().slice(0, 19).replace('T', ' '),
              keterangan: 'Pemesanan berhasil dibuat & diverifikasi'
            }
          ]
        }
      };
      this.$emit('add-order', newDO);
      alert(`Pemesanan Berhasil!\n\nNIM: ${this.formOrder.nim}\nNama: ${this.formOrder.nama}\nTotal: ${this.formatCurrency(paketHarga)}`);
      
      this.formOrder = { nim: '', nama: '', ekspedisi: '', tanggalkirim: '', paket: '' };
    }
  }
});