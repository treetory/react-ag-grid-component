import "./styles.css";
import React, { useRef, useState, useEffect } from "react";
import { GridReadyEvent } from "ag-grid-community";
import { CellChangedEvent } from "ag-grid-community/dist/lib/entities/rowNode";
import { AgGrid } from "./component/Grid";

import Dexie, { Table } from 'dexie';
interface MockUp {
    rowId?: number;
    make?: string;
    model?: string;
    price?: number;
}

class MockUpDB extends Dexie {
    apps: Table<MockUp, number>;
    constructor() {
        super('MockUpDB');
        this.version(1).stores({
            apps: "++rowId, make, model, price"
        })
    }
}

/**
 * @author treetory@gmail.com
 * 
 * The example to use the ag grid with react
 * 
 * @returns 
 */
export default function App() {

    const gridRef = useRef<any>(null);

    const db = new MockUpDB();

    const columnDefs = [
        { checkboxSelection: true, field: 'make', editable: true, onCellValueChanged: (e: CellChangedEvent) => { console.log('in ColumnDef ---> ', e) } },
        { field: 'model', editable: true, },
        { field: 'price', editable: true, }
    ];

    const applyTransactionForAdd = () => {
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
        // get initial data from server
        const initialRowData = [
            { make: "Toyota", model: "Celica", price: 35000 },
            { make: "Ford", model: "Mondeo", price: 32000 },
            { make: "Porsche", model: "Boxster", price: 72000 }
        ];
        // make the transaction to set the data into db's table
        db.transaction('rw', db.apps, (transaction) => {
            // check the data is already existed
            return db.apps.count()
                .then(cnt => {
                    // if data is not existed in indexdb, add
                    if (cnt <= 0) {
                        db.apps.bulkAdd(initialRowData);
                    }
                    return Promise.resolve(cnt);
                }).then(async cnt => {
                    // if data is existed in indexdb, get the data and set it to grid
                    if (cnt > 0) {
                        const rowData = await (await db.apps.where('rowId').above(0).toArray()).map(row => {
                            delete row.rowId;
                            return row;
                        });
                        const grid = gridRef.current?.getCurrentGridApi();
                        grid.setRowData(rowData);
                    }
                })
        }).catch(e => {
            console.error(e.stack || e);
        })

    }

    /**
     * set the cell value change event into the grid
     * in most case, we synchronize the value with indexdb's row data.
     * 
     * @param e 
     */
    const onCellValueChanged = (e: CellChangedEvent) => {
        console.warn('in GridOption ---> ', e);
        console.warn(db.name);
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
                    <button onClick={applyTransactionForAdd}>add more data</button>
                    <button onClick={() => {
                        toggleEditable(['make']);
                    }}>toggleEditable</button>
                </span>
            </div>
        </div>
    );
}
