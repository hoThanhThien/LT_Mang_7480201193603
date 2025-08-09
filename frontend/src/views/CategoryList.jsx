import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../services/categoryService';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);
  return (
    <div>
      <h2>Category List</h2>
      <ul>
        {categories.map(c => <li key={c.category_id}>{c.category_name}</li>)}
      </ul>
    </div>
  );
}
