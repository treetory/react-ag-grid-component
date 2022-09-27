import "./styles.css";
import { AgGrid } from "./component/Grid";
import React, { useRef, useState, useEffect } from "react";
import { GridReadyEvent } from "ag-grid-community";
import { CellChangedEvent } from "ag-grid-community/dist/lib/entities/rowNode";

/**
 * @author treetory@gmail.com
 * 
 * The example to use the ag grid with react
 * 
 * @returns 
 */
export default function App() {

    const gridRef = useRef<any>(null);

    const columnDefs = [
        { checkboxSelection: true, field: 'make', editable: true, onCellValueChanged: (e: CellChangedEvent) => { console.log('in ColumnDef ---> ', e) } },
        { field: 'model', editable: true, },
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

    /**
     * Toggle the editable value(boolean) for specific columns
     * 
     * @param cols 
     */
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

    /**
     * set the initial event when grid is ready.
     * in most case, we set the initial data using this event handler
     * 
     * @param e 
     */
    const onGridReady = (e: GridReadyEvent) => {
        const grid = gridRef.current?.getCurrentGridApi();
        grid.setRowData([
            { make: "Toyota", model: "Celica", price: 35000 },
            { make: "Ford", model: "Mondeo", price: 32000 },
            { make: "Porsche", model: "Boxster", price: 72000 }
        ]);
    }

    /**
     * set the cell value change event into the grid
     * in most case, we synchronize the value with indexdb's row data.
     * 
     * @param e 
     */
    const onCellValueChanged = (e: CellChangedEvent) => {
        console.warn('in GridOption ---> ', e);
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
