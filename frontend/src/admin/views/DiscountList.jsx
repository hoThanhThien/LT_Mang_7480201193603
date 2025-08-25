import React, { useEffect, useState } from "react";
import {
  fetchDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../services/discountService";
import DiscountTable from "../components/tables/DiscountTable";

export default function DiscountList() {
  const [discounts, setDiscounts] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_amount: 0,
    is_percent: false,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    const data = await fetchDiscounts();
    setDiscounts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateDiscount(editing.discount_id, form);
    } else {
      await createDiscount(form);
    }
    resetForm();
    loadDiscounts();
  };

  const handleEdit = (discount) => {
    setEditing(discount);
    setForm({ ...discount });
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá mã giảm giá này không?")) {
      await deleteDiscount(id);
      loadDiscounts();
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormVisible(false);
    setEditing(null);
    setForm({
      code: "",
      description: "",
      discount_amount: 0,
      is_percent: false,
      start_date: "",
      end_date: "",
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh sách mã giảm giá</h2>

      {!formVisible && (
        <button className="btn btn-success mb-3" onClick={() => setFormVisible(true)}>
          + Thêm Discount
        </button>
      )}

      <DiscountTable discounts={discounts} onEdit={handleEdit} onDelete={handleDelete} />

      {formVisible && (
        <form onSubmit={handleSubmit} className="mt-4 border p-3">
          <h4>{editing ? `Sửa mã giảm giá #${editing.discount_id}` : "Thêm mã giảm giá mới"}</h4>

          <div className="mb-2">
            <label>Mã code:</label>
            <input
              type="text"
              className="form-control"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <label>Mô tả:</label>
            <input
              type="text"
              className="form-control"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label>Số tiền giảm:</label>
            <input
              type="number"
              className="form-control"
              value={form.discount_amount}
              onChange={(e) => setForm({ ...form, discount_amount: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={form.is_percent}
              onChange={(e) => setForm({ ...form, is_percent: e.target.checked })}
              id="isPercentCheck"
            />
            <label className="form-check-label" htmlFor="isPercentCheck">
              Tính theo phần trăm
            </label>
          </div>

          <div className="mb-2">
            <label>Ngày bắt đầu:</label>
            <input
              type="date"
              className="form-control"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              required
            />
          </div>

          <div className="mb-2">
            <label>Ngày kết thúc:</label>
            <input
              type="date"
              className="form-control"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-success me-2">
            {editing ? "Lưu thay đổi" : "Thêm"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Huỷ
          </button>
        </form>
      )}
    </div>
  );
}
