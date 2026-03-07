import React, { useEffect, useState } from 'react';
import { getFeedings } from '../api/api'; // api.ts의 경로
import type { FeedingType } from '../types/models'; // models에서 FeedingType import

export default function Feeding() {
  const [feedings, setFeedings] = useState<FeedingType[]>([]);
  const [selectedBabyId, setSelectedBabyId] = useState<number | null>(1); // childId가 number이므로 변경

  useEffect(() => {
    if (selectedBabyId) {
      getFeedings(selectedBabyId).then((data) => setFeedings(data)).catch(console.error);
    }
  }, [selectedBabyId]);

  return (
    <div>
      <h1>Feeding Records</h1>
      {selectedBabyId ? (
        <ul>
          {feedings.map((feeding) => (
            <li key={feeding.id}>
              Amount: {feeding.amount}, Time: {feeding.recorded_at}
            </li>
          ))}
        </ul>
      ) : (
        <p>No baby selected.</p>
      )}
    </div>
  );
}