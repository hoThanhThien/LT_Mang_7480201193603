import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import CategoryTable from "../components/tables/CategoryTable";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateCategory(editing.category_id, form);
    } else {
      await createCategory(form);
    }
    setForm({ name: "", description: "" });
    setEditing(null);
    setFormVisible(false);
    loadCategories();
  };

  const handleEdit = (category) => {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description,
    });
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá danh mục này không?")) {
      try {
  await deleteCategory(id);
  loadCategories();
} catch (error) {
  const msg = error?.response?.data?.detail || "Đã có lỗi xảy ra khi xoá danh mục.";
  alert(msg); // hoặc console.error(msg)
}

    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setFormVisible(false);
  };

  return (
    <div className="category-list">
      <h2>Danh sách danh mục</h2>

      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setFormVisible(!formVisible)}>
          {formVisible ? "Ẩn form" : "➕ Thêm danh mục"}
        </button>
      </div>

      {/* ✅ Hiển thị bảng trước */}
      <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />

      {/* ✅ Form sẽ hiện bên dưới */}
      {formVisible && (
        <form onSubmit={handleSubmit} className="mt-4">
          <h4>{editing ? `Chỉnh sửa danh mục #${editing.category_id}` : "Thêm danh mục mới"}</h4>
          <div className="mb-2">
            <label>Tên danh mục:</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="mb-2">
            <label>Mô tả:</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="form-control"
              rows={3}
            />
          </div>
          <button type="submit" className="btn btn-success">
            {editing ? "Lưu thay đổi" : "Thêm"}
          </button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary ms-2">
            Huỷ
          </button>
        </form>
      )}
    </div>
  );
}
