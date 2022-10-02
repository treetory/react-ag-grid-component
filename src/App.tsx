import "./styles.css";
import React, { useRef, useState, useEffect } from "react";
import { CellValueChangedEvent, GridReadyEvent, RowValueChangedEvent } from "ag-grid-community";
import { AgGrid } from "./component/Grid";
import { MockUpDB } from "./dexie/MockUpDB";
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
    const db = new MockUpDB({ apps: "rowId, make, model, price" });

    /**
     * make the columnDefinitions to draw the grid' columns
     */
    const columnDefs = [
        { field: 'rowId', hide: false, editable: false },
        { checkboxSelection: true, field: 'make', editable: true, onCellValueChanged: (e: CellValueChangedEvent) => { console.log('in ColumnDef ---> ', e) } },
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
        db.addRowDatas(addedRowData);
    }

    /**
     * delete the selected data both grid and indexeddb
     */
    const applyTransactionForDelete = () => {
        const gridApi = gridRef.current?.getCurrentGridApi();
        const selectedNodes: any[] = gridApi.getSelectedNodes();
        // const selectedRows: any[] = gridApi.getSelectedRows();
        if (selectedNodes.length > 0) {
            // console.warn(selectedNodes, selectedRows);
            db.deleteRowDatas(selectedNodes);
        }
    }

    /**
     * close the db
     */
    const clearDB = () => {
        db.apps.clear();
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
            db.addRowDatas(initialRowData);
    }

    /**
     * set the cell value change event into the grid
     * but we send the whole row data that have been updated
     * because we still need the primKey of table
     * and need to create the Object to update. so need the whole shaped data.
     * 
     * in most case, we synchronize the value with indexeddb's row data.
     * 
     * @param e 
     */
    const onCellValueChanged = (e: CellValueChangedEvent) => {
        db.updateCellData(e.data);
    }

    /**
     * 
     * 이 이벤트가 언제 발생하는지 확인할 필요가 있다.
     * 현재 cell 의 데이터를 변화시킨 것이 여기에 영향을 미치진 않는다.
     * 아마, row edit mode 로 동작시킨 것이 여기에 영향을 미칠 것 같다.
     * 
     * @param e 
     */
    const onRowValueChanged = (e: RowValueChangedEvent) => {
        db.updateRowData(e.data);
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
                onRowValueChanged={onRowValueChanged}
            />
            <div>
                <span>
                    <button onClick={clearDB}>clearDB</button>
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
