const cron = require('node-cron');
const { poolPromise } = require('../db');

// Lập lịch chạy vào 00:00 mỗi ngày: '0 0 * * *'
// Để test nhanh, bạn có thể đổi thành '* * * * *' (chạy mỗi phút)
cron.schedule('0 0 * * *', async () => {
    console.log('🔄 Đang chạy Job tự động kiểm tra thuốc hết hạn...');
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                UPDATE Thuoc 
                SET trangThai = 0 
                WHERE ngayHetHan < CAST(GETDATE() AS DATE) AND trangThai = 1
            `);
        
        console.log(`✅ Job hoàn tất: Đã vô hiệu hóa ${result.rowsAffected[0] || 0} thuốc đã hết hạn.`);
    } catch (error) {
        console.error('❌ Lỗi khi chạy Job kiểm tra thuốc hết hạn:', error);
    }
});

console.log('🕒 Cron Job Cảnh báo thuốc hết hạn đã được khởi chạy.');
