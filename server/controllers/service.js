import { serviceDao } from "../dao/index.js";
import Service from "../models/service.js";

const fetchAllService = async (req, res) => {
  try {
    const service = await serviceDao.fetchAllService()
    res.status(200).json(service)
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const addService = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    if (!name || price == null) {
      // name và price là bắt buộc
      return res.status(400).json({ error: "Tên dịch vụ và giá là bắt buộc" });
    }

    const service = new Service({ name, description, price, duration });
    const saved = await service.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding service:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi thêm dịch vụ' });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};
    // chỉ cho phép cập nhật các field sau
    ["name", "description", "price", "duration"].forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Không có trường hợp lệ để cập nhật" });
    }

    const updated = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Không tìm thấy dịch vụ với ID này" });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi cập nhật dịch vụ' });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Không tìm thấy dịch vụ với ID này" });
    }
    res.json({ message: "Xóa dịch vụ thành công", id });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ error: err.message || 'Lỗi khi xóa dịch vụ' });
  }
};

export default { fetchAllService, addService, updateService, deleteService };
