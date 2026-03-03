import React, { useState } from 'react';
import { feedingLogColumns, constFeedingTimeTable, type typeFeedingLog } from '../types/scheduleType';
import { Checkbox, Input } from 'antd';
import { FaPoop } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";
import { IoWaterOutline } from "react-icons/io5";
import { IoWater } from "react-icons/io5";
interface TableProps {
    dataColumn: Object[];
    dataTable: Object[];
    setDataTable: (dataTable: Object[]) => void;
}
// {dataColumn, dataTable}:TableProps
const TableComponent = () => {
    const dataColumn = feedingLogColumns
    const [dataTable, setDataTable] = useState<typeFeedingLog[]>(constFeedingTimeTable)
    const handleDataTable = <K extends keyof typeFeedingLog>(
        index: number,
        key: K,
        value: typeFeedingLog[K]
    ) => {
        setDataTable(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, [key]: value }
                    : item
            )
        )
    }
    return (
        <div>
            <table>
                <tr>
                    {dataColumn.map((item, index) =>
                        <th>{item.label}</th>
                    )}
                </tr>
                {dataTable.map((dataObj, dataIndex) => {
                    return <tr>
                        <td>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <div>{dataObj["hours"]}</div>:
                                <Input value={dataObj["minute"]} size='small' />
                            </div>

                        </td>
                        <td>
                            <Input value={dataObj["milkAmount"]} size='small' />
                        </td>

                        <td>
                            <Input value={dataObj["sleepTime"]} size='small' />
                        </td>
                        <td onClick={()=> handleDataTable(dataIndex, "pee", !dataObj["pee"])}>
                            {dataObj["pee"] ? <IoWater color='#ebc934' /> : <IoWaterOutline color='#ebc934' />}
                        </td>
                        <td onClick={()=> handleDataTable(dataIndex, "poop", !dataObj["poop"])}>
                            {dataObj["poop"] ? <FaPoop color='#9e6a09' /> : <FaPoop color='#eee' />}
                        </td>
                    </tr>
                }

                )}
            </table>


        </div>
    );
};

export default TableComponent;