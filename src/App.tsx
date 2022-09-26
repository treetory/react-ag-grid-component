import "./styles.css";
import { AgGrid } from "./component/Grid";
import React, { useRef, useState } from "react";

export default function App() {

    const gridRef = useRef<any>(null);

    const rowData: any[] = [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxster", price: 72000 }
    ];

    const columnDefs = [
        { checkboxSelection: true, field: 'make', editable: true, onCellValueChanged: (params: any) => { console.log('column', params) } },
        { field: 'model', editable: false, },
        { field: 'price', editable: true, }
    ];

    const applyTransaction = () => {
        const gridApi = gridRef.current?.getCurrentGridApi();
        gridApi.applyTransaction(
            {
                add:
                    [
                        { make: "Hyundai", model: "Grandeur", price: 15000 },
                        { make: "KIA", model: "K9", price: 12000 },
                        { make: "Tesla", model: "Model3", price: 92000 }
                    ]
            }
        );
    }

    const toggleEditable = (isEditable: boolean, cols: string[]): void => {
        const grid = gridRef.current?.getCurrentGridApi()
        const _columnDefs: any[] = grid.getColumnDefs();
        _columnDefs.forEach(function (colDef) {
            console.warn(colDef);
            colDef.editable = isEditable;
        });
        grid.setColumnDefs(_columnDefs);
    }

    let [isEditable, setEditable] = useState(true);

    return (
        <div className="App">
            <h1>Hello AG Grid</h1>
            <AgGrid
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
            />
            <span>
                <button onClick={applyTransaction}>applyTransaction</button>
                <button onClick={() => {
                    setEditable(isEditable === true ? false : true);
                    toggleEditable(isEditable, []);
                }}>toggleEditable</button>
            </span>
        </div>
    );
}
