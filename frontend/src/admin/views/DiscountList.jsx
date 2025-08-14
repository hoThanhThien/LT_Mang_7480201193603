import React, { useEffect, useState } from 'react';
import { fetchDiscounts } from '../services/discountService';

export default function DiscountList() {
  const [discounts, setDiscounts] = useState([]);
  useEffect(() => {
    fetchDiscounts().then(setDiscounts);
  }, []);
  return (
    <div>
      <h2>Discount List</h2>
      <ul>
        {discounts.map(d => <li key={d.discount_id}>{d.code}</li>)}
      </ul>
    </div>
  );
}
