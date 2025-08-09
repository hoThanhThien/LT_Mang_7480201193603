import React, { useEffect, useState } from 'react';
import { fetchGuides } from '../services/guideService';

export default function GuideList() {
  const [guides, setGuides] = useState([]);
  useEffect(() => {
    fetchGuides().then(setGuides);
  }, []);
  return (
    <div>
      <h2>Guide List</h2>
      <ul>
        {guides.map(g => <li key={g.guide_id}>{g.name}</li>)}
      </ul>
    </div>
  );
}
