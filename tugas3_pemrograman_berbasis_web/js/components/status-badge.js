Vue.component('status-badge', {
  template: '#tpl-badge',
  props: {
    qty: { type: Number, required: true },
    safety: { type: Number, required: true },
    catatan: { type: String, default: '' }
  },
  data() {
    return { showTooltip: false };
  },
  computed: {
    statusInfo() {
      if (this.qty === 0) {
        return { label: 'Kosong', class: 'badge-danger', icon: '' };
      } else if (this.qty < this.safety) {
        return { label: 'Menipis', class: 'badge-warning', icon: '' };
      } else {
        return { label: 'Aman', class: 'badge-success', icon: '' };
      }
    }
  }
});