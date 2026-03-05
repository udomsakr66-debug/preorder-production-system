// ตัวอย่าง logic: พื้นที่ (ตร.ซม.) * จำนวน * ราคาวัสดุ
module.exports = (specs) => {
    const basePrice = 100; // ราคาเริ่มต้น
    const area = (specs.width * specs.height) || 1;
    const materialMultiplier = specs.material === 'premium' ? 2 : 1;
    
    const total = (basePrice + (area * 0.5)) * specs.quantity * materialMultiplier;
    return Math.round(total);
};