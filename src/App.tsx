import "./styles.css";
import { AgGrid } from "./component/Grid";
import React, { useRef, useState, useEffect } from "react";
import { GridReadyEvent } from "ag-grid-community";
import { CellChangedEvent } from "ag-grid-community/dist/lib/entities/rowNode";

export default function App() {

    const gridRef = useRef<any>(null);

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

    const toggleEditable = (cols: string[]): void => {
        const grid = gridRef.current?.getCurrentGridApi();
        const _columnDefs: any[] = grid.getColumnDefs();
        _columnDefs.map(colDef => {
            if (cols.includes(colDef.field))
                colDef.editable = colDef.editable === true ? false : true;
            return colDef;
        });
        grid.setColumnDefs(_columnDefs);
    }

    const onGridReady = (e: GridReadyEvent) => {
        const grid = gridRef.current?.getCurrentGridApi();
        grid.setRowData([
            { make: "Toyota", model: "Celica", price: 35000 },
            { make: "Ford", model: "Mondeo", price: 32000 },
            { make: "Porsche", model: "Boxster", price: 72000 }
        ]);
    }

    const onCellValueChanged = (e: CellChangedEvent) => {
        console.warn(e);
    }

    useEffect(() => {

    }, [])

    return (
        <div className="App">
            <h1>Hello AG Grid</h1>
            <AgGrid
                ref={gridRef}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                onCellValueChanged={onCellValueChanged}
            />
            <div>
                <span>
                    <button onClick={applyTransaction}>applyTransaction</button>
                    <button onClick={() => {
                        toggleEditable(['make']);
                    }}>toggleEditable</button>
                </span>
            </div>
        </div>
    );
}
