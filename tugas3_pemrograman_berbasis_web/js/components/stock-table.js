Vue.component('ba-stock-table', {
  template: '#tpl-stock',
  props: {
    items: { type: Array, required: true },
    upbjjList: { type: Array, required: true },
    kategoriList: { type: Array, required: true }
  },
  data() {
    return {
      searchQuery: '',
      selectedUpbjj: '',       // Wajib ada
      selectedKategori: '',    // Wajib ada
      filterReorderOnly: false,
      sortBy: 'judul',
      form: {
        isEdit: false,
        editIndex: -1,
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
      }
    };
  },
  watch: {
    selectedUpbjj(newVal) {
      if (newVal) this.selectedKategori = '';
    }
  },
  computed: {
    filteredAndSortedItems() {
      return this.items
        .filter(item => {
          const matchSearch = this.searchQuery ? item.judul.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;
          // Memastikan pencocokan filter UPBJJ dan Kategori membaca selectedUpbjj & selectedKategori
          const matchUpbjj = this.selectedUpbjj ? item.upbjj === this.selectedUpbjj : true;
          const matchKategori = this.selectedKategori ? item.kategori === this.selectedKategori : true;
          const matchReorder = this.filterReorderOnly ? (item.qty <= item.safety || item.qty === 0) : true;
          
          return matchSearch && matchUpbjj && matchKategori && matchReorder;
        })
        .sort((a, b) => {
          if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul);
          if (this.sortBy === 'qty') return a.qty - b.qty;
          if (this.sortBy === 'harga') return a.harga - b.harga;
          return 0;
        });
    }
  },
  methods: {
    formatCurrency(val) { return 'Rp ' + Number(val).toLocaleString('id-ID'); },
    resetFilters() {
      this.searchQuery = '';
      this.selectedUpbjj = '';
      this.selectedKategori = '';
      this.filterReorderOnly = false;
      this.sortBy = 'judul';
    },
    editItem(item, index) {
      this.form = { ...item, isEdit: true, editIndex: index };
    },
    saveForm() {
      if (!this.form.kode || !this.form.judul) {
        alert('Kode dan Judul Mata Kuliah wajib diisi!');
        return;
      }
      const payload = {
        kode: this.form.kode,
        judul: this.form.judul,
        kategori: this.form.kategori || 'MK Wajib',
        upbjj: this.form.upbjj || 'Jakarta',
        lokasiRak: this.form.lokasiRak || '-',
        harga: Number(this.form.harga),
        qty: Number(this.form.qty),
        safety: Number(this.form.safety),
        catatanHTML: this.form.catatanHTML || '<span class="baru">Baru</span>'
      };
      if (this.form.isEdit) {
        this.$emit('update-item', { index: this.form.editIndex, data: payload });
      } else {
        this.$emit('add-item', payload);
      }
      this.resetForm();
    },
    resetForm() {
      this.form = { isEdit: false, editIndex: -1, kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: '' };
    },
    confirmDelete(kode) {
      this.$emit('request-delete', kode);
    }
  }
});