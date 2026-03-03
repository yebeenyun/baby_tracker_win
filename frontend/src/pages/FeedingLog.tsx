import React, { useEffect, useState } from 'react';
import { constFeedingTimeTable, type typeFeedingLog } from '../types/scheduleType';
import TableComponent from '../component/Table';

const FeedingLog = () => {
    const [tableData, setTableData] = useState<typeFeedingLog[]>(constFeedingTimeTable)
    return (
        <div>
            <div>
               <TableComponent/>
            </div>
        </div>
    );
};

export default FeedingLog;