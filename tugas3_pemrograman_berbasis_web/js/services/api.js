const ApiService = {
  async fetchData() {
    try {
      const response = await fetch('./data/dataBahanAjar.json');
      if (!response.ok) throw new Error('Gagal memuat data JSON');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  }
};