exports.getStats = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: { totalOrders: 0, pending: 0, completed: 0 }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};