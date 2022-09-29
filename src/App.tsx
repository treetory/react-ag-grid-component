import "./styles.css";
import React, { useRef, useState, useEffect } from "react";
import { GridReadyEvent } from "ag-grid-community";
import { CellChangedEvent } from "ag-grid-community/dist/lib/entities/rowNode";
import { AgGrid } from "./component/Grid";

import Dexie, { Table } from 'dexie';
interface MockUp {
    rowId: number;     // rowId is only use for indexeddb. it's a indexed key.
    make?: string;
    model?: string;
    price?: number;
}

enum GRID_TRANSACTION_TYPE {
    ADD = "add", UPDATE = "update", REMOVE = "remove"
}

export const foldr = <A, B>(f: (x: A, acc: B) => B, acc: B, [h, ...t]: A[]): B =>
    h === undefined ? acc : f(h, foldr(f, acc, t));

export const foldl = <A, B>(f: (x: A, acc: B) => B, acc: B, [h, ...t]: A[]): B =>
    h === undefined ? acc : foldl(f, f(h, acc), t);

class MockUpDB extends Dexie {
    apps: Table<MockUp, number>;
    grid: any;
    constructor() {
        super('MockUpDB');
        this.version(1).stores({
            apps: "rowId, make, model, price"
        })
    }

    setGridRef(gridRef: any) {
        this.grid = gridRef.current?.getCurrentGridApi();
        this.apps.hook('creating', (primKey, obj, transaction) => {
            let myTransaction = {
                add: new Array(), update: new Array(), remove: new Array()
            }
            myTransaction.add.push(obj);
            this.grid.applyTransaction(myTransaction);
        });
        this.apps.hook('updating', (primKey, obj, transaction) => {
            let myTransaction = {
                add: new Array(), update: new Array(), remove: new Array()
            }
            myTransaction.update.push(obj);
            this.grid.applyTransaction(myTransaction);
        });
        this.apps.hook('deleting', (primKey, obj, transaction) => {
            let myTransaction = {
                add: new Array(), update: new Array(), remove: new Array()
            }
            myTransaction.remove.push(obj);
            this.grid.applyTransaction(myTransaction);
        });
    }

    integrateIndexedDbRowsToGrid = async () => {
        if (await this.apps.count() > 0) {
            const indexedDbRows = await this.apps.where('rowId').above(0).toArray();
            this.grid.applyTransaction({ add: indexedDbRows });
        }
    }

    addRowItems = (rows: MockUp[]) => {
        this.transaction('rw', this.apps, async (transaction) => {
            //     return this.apps.filter(app => rows.findIndex(
            //         row => row.make === app.make
            //             && row.model === app.model
            //             && row.price === app.price
            //             && app.rowId
            //     ) > -1).primaryKeys()
            //         .then(async primKeys => {
            //             // console.warn(primKeys);
            //             // if data is not existed in indexdb, add
            //             if (primKeys.length <= 0) {
            //                 primKeys = await this.apps.bulkAdd(rows, { allKeys: true });
            //             }
            //             return Promise.resolve(await this.apps.where('rowId').anyOf(primKeys).toArray());
            //         }).then(async rowData => {
            //             // console.warn(rowData)
            //             // if data is existed in indexdb, get the data and set it to grid
            //             let myTransaction = {
            //                 add: new Array(), update: new Array(), remove: new Array()
            //             }
            //             this.grid.forEachNode((node: any) => {
            //                 // const row = rowData.find(row => row.rowId === node.data.rowId);
            //                 // console.warn(row);
            //                 // if (row)
            //                 //     myTransaction.update.push(row)
            //                 // else
            //                 //     myTransaction.add.push(row)
            //             })
            //             this.grid.applyTransaction(myTransaction);
            //         })
            // }).catch(e => {
            //     console.error(e.stack || e);

            // 1. indexedDb 에 확인한다.
            // 2. indexedDb 에 있고, grid 에 없으면 add items
            // 3. indexedDb 에 있고, grid 에 있으면 update items
            // 4. grid 에 transaction 을 적용한다.
            rows.forEach(async row => {
                const app = await this.apps.get(row.rowId);
                if (app) {
                    this.apps.update(app.rowId, app);
                } else {
                    this.apps.add(row);

                }
            })
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
    /**
     * the reference of AG Grid
     */
    const gridRef = useRef<any>();

    /**
     * create the db for this App and set the hooks 
     * to integrate data between indexeddb and grid
     */
    const db = new MockUpDB();
    // db.apps.hook('creating', (primKey, obj, transaction) => {
    //     console.warn(primKey, obj, transaction);
    //     const gridApi = gridRef.current?.getCurrentGridApi();
    //     gridApi.applyTransaction({ add: [obj] });
    // });
    // db.apps.hook('deleting', (primKey, obj, transaction) => {
    //     console.warn(obj);
    // });

    /**
     * make the columnDefinitions to draw the grid' columns
     */
    const columnDefs = [
        { field: 'rowId', hide: false },
        { checkboxSelection: true, field: 'make', editable: true, onCellValueChanged: (e: CellChangedEvent) => { console.log('in ColumnDef ---> ', e) } },
        { field: 'model', editable: true, },
        { field: 'price', editable: true, }
    ];

    /**
     * add more data into the table (indexeddb)
     */
    const applyTransactionForAdd = () => {

        const addedRowData = [
            { rowId: 4, make: "Hyundai", model: "Grandeur", price: 15000 },
            { rowId: 5, make: "KIA", model: "K9", price: 12000 },
            { rowId: 6, make: "Tesla", model: "Model3", price: 92000 }
        ];

        // make the transaction to set the data into db's table
        db.addRowItems(addedRowData);
    }

    /**
     * delete the selected data both grid and indexeddb
     */
    const applyTransactionForDelete = () => {
        const gridApi = gridRef.current?.getCurrentGridApi();
        const selectedNodes: any[] = gridApi.getSelectedNodes();
        const selectedRows: any[] = gridApi.getSelectedRows();
        if (selectedNodes.length > 0) {
            console.warn(selectedNodes, selectedRows);
        }
    }

    /**
     * close the db
     */
    const closeDB = () => {
        db.delete();
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
        db.setGridRef(gridRef);
        // get initial data from server
        const initialRowData = [
            { rowId: 1, make: "Toyota", model: "Celica", price: 35000 },
            { rowId: 2, make: "Ford", model: "Mondeo", price: 32000 },
            { rowId: 3, make: "Porsche", model: "Boxster", price: 72000 }
        ];
        // make the transaction to set the data into db's table
        db.integrateIndexedDbRowsToGrid();

        if (initialRowData.length > 0)
            db.addRowItems(initialRowData);
    }

    /**
     * set the cell value change event into the grid
     * in most case, we synchronize the value with indexeddb's row data.
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
                    <button onClick={closeDB}>closeDB</button>
                    <button onClick={applyTransactionForAdd}>add more data</button>
                    <button onClick={applyTransactionForDelete}>delete selected data</button>
                    <button onClick={() => {
                        toggleEditable(['make']);
                    }}>toggleEditable</button>

                </span>
            </div>
        </div>
    );
}
