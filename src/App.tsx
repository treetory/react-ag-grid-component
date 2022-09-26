import "./styles.css";
import { AgGrid } from "./component/Grid";
import {useRef, useState} from "react";


export default function App() {
    
    const rowData: any[] = [
        {make: "Toyota", model: "Celica", price: 35000},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxster", price: 72000}
    ];

    const gridRef = useRef<any>(null);
    const applyTransaction = () => { 
        const gridApi = gridRef.current?.getCurrentGridApi();
        gridApi.applyTransaction(
            {
                add: 
                    [
                        {make: "Hyundai", model: "Grandeur", price: 15000},
                        {make: "KIA", model: "K9", price: 12000},
                        {make: "Tesla", model: "Model3", price: 92000}
                    ]
            }
        );
    }
    
    const setEditable = (isEditable: boolean, cols: string[]): boolean  => {
        const grid = gridRef.current?.getCurrentGridApi()
        const columnDefs: any[] = grid.getColumnDefs();
        // const newColumDef = columnDefs.filter(
        //     columnDef => 
        //     cols.findIndex(col => col === columnDef.field) > 0)
        //     .every(columnDef => columnDef.editable = isEditable)
        columnDefs.forEach(function (colDef) {
            console.warn(colDef);
            colDef.editable = isEditable;
        });
        grid.setColumnDefs(columnDefs);
        return isEditable;
    }
    
    let [isEditable] = useState(true);
    
    return (
    <div className="App">
        <h1>Hello AG Grid</h1>
        <AgGrid
            ref={gridRef}
            rowData={rowData}
        />
        <span>
            <button onClick={applyTransaction}>applyTransaction</button>
            <button onClick={() => {
                isEditable = setEditable(isEditable ? false : true, []);    
            }}>setEditable</button>
        </span>
    </div>
  );
}
