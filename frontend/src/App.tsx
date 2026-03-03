import { useState } from 'react'
import './App.css'
import { Tabs } from 'antd';
import Today from './pages/Today';
import FeedingLog from './pages/FeedingLog';
import { IoHomeSharp } from "react-icons/io5";
import { LuBaby } from "react-icons/lu";
import Profile from './pages/Profile';
import { GiBabyBottle } from "react-icons/gi";
import { FaBowlFood } from "react-icons/fa6";
const App: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    items={
      [
      {
        label: <IoHomeSharp/>,
        key: "0",
        children: <Today/>,
      },
      {
        label: <FaBowlFood/>,
        key: "1",
        children: <FeedingLog/>,
      },
      
      {
        label: <LuBaby/>,
        key: "2",
        children: <Profile/>,
      },
    ]
    }
  />
);


export default App
