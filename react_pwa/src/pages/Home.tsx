import React, { useEffect, useState } from 'react';
import { getFeedings, createFeeding } from '../api/api';
import type { FeedingType } from '../types/models';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastFeedingTime, setLastFeedingTime] = useState<Date | null>(null);
  const [feedingInterval, setFeedingInterval] = useState<number>(120); // 수유 텀 (분 단위, 예: 2시간)
  const [selectedBabyId, setSelectedBabyId] = useState<number | null>(1); // 선택된 아기 ID
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedingAmount, setFeedingAmount] = useState('');
  const [feedingTime, setFeedingTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedBabyId) {
      getFeedings(selectedBabyId).then((data: FeedingType[]) => {
        if (data.length > 0) {
          const lastFeeding = data[data.length - 1];
          setLastFeedingTime(new Date(lastFeeding.date_time));
        }
      }).catch(console.error);
    }
  }, [selectedBabyId]);

  const handleRecordFeeding = async () => {
    if (!selectedBabyId || !feedingAmount || !feedingTime) return;
    try {
      await createFeeding({
        child_id: selectedBabyId,
        amount: parseFloat(feedingAmount),
        date_time: new Date(feedingTime).toISOString(),
      });
      setIsModalOpen(false);
      setFeedingAmount('');
      setFeedingTime('');
      // 마지막 수유 시간 업데이트
      if (selectedBabyId) {
        getFeedings(selectedBabyId).then((data: FeedingType[]) => {
          if (data.length > 0) {
            const lastFeeding = data[data.length - 1];
            setLastFeedingTime(new Date(lastFeeding.date_time));
          }
        }).catch(console.error);
      }
    } catch (error) {
      console.error('수유 기록 실패:', error);
    }
  };

  const timeUntilNextFeeding = () => {
    if (!lastFeedingTime) return '다음 수유 텀 : 데이터 없음';
    const nextFeeding = new Date(lastFeedingTime.getTime() + feedingInterval * 60000);
    const diff = nextFeeding.getTime() - currentTime.getTime();
    if (diff <= 0) return '다음 수유 텀 : 수유 시간!';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `다음 수유 텀 : ${hours}시간 ${minutes}분`;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'var(--primary-xlight)', position: 'relative', minHeight: '100vh' }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'var(--primary-dark)',
        color: 'var(--white)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        fontFamily: 'monospace',
        fontSize: '3em',
        border: `2px solid var(--accent-border)`,
        whiteSpace: 'nowrap'
      }}>
        {currentTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
      </div>
      
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'var(--white)',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        fontSize: '1.2em',
        color: 'var(--primary-dark)',
        textAlign: 'center'
      }}>
        {timeUntilNextFeeding()}
      </div>
      
      <button 
        onClick={() => {
          setIsModalOpen(true);
          setFeedingTime(new Date().toISOString().slice(0, 16));
        }}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'var(--white)',
          border: 'none',
          fontSize: '30px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 1001
        }}
        aria-label="수유 기록 추가"
      >
        +
      </button>
      
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '20px',
            borderRadius: '10px',
            width: '300px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--primary-dark)' }}>수유 기록</h3>
            <input
              type="number"
              placeholder="수유량 (ml)"
              value={feedingAmount}
              onChange={(e) => setFeedingAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid var(--primary-light)',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
            <input
              type="datetime-local"
              value={feedingTime}
              onChange={(e) => setFeedingTime(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                border: '1px solid var(--primary-light)',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--gray)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button 
                onClick={handleRecordFeeding}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                기록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}