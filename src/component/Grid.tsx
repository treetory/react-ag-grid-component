import * as env from 'env-var';
import React, { useState, useRef, useImperativeHandle, useMemo } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { GridReadyEvent } from 'ag-grid-community';
import { RowValueChangedEvent, CellValueChangedEvent } from 'ag-grid-community/dist/lib/events';


const LICENSE_KEY: string = env.get('REACT_APP_AGGRID_LICENSE_KEY').required().asString();
LicenseManager.setLicenseKey(LICENSE_KEY);

/**
 * @author treetory@gmail.com
 * 
 * The props for Wrapped Grid
 */
export type GridProps = {
    columnDefs: any[],
    onGridReady: (e: GridReadyEvent) => void,
    onRowValueChanged?: (e: RowValueChangedEvent) => void;
    onCellValueChanged?: (e: CellValueChangedEvent) => void;
}

/**
 * @author treetory@gmail.com
 * 
 * The Grid Component to wrap the AG Grid
 * 
 * @param props 
 * @param ref reference of AG Grid, to show the api externally.
 * @returns React.Component
 */
const Grid = (props: GridProps, ref: any) => {

    const displayName = 'Grid';

    const { columnDefs, onGridReady, onCellValueChanged } = props;

    const gridRef = useRef<AgGridReact>(null);

    useImperativeHandle(ref, () => ({
        getCurrentGridApi: () => {
            return gridRef.current?.api;
        },
        getCurrentColumnApi: () => {
            return gridRef.current?.columnApi;
        }
    }));

    const statusBar = {
        statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
        ]
    };

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: 'inherit' }}>
            <AgGridReact
                ref={gridRef}
                getRowId={(params) => params.data.rowId}
                rowData={[]}
                defaultColDef={{
                    editable: true
                }}
                columnDefs={columnDefs}
                rowSelection={'multiple'}
                singleClickEdit={true}
                // stopEditingWhenCellsLoseFocus={true}
                // suppressClickEdit={false}
                undoRedoCellEditing={true}
                undoRedoCellEditingLimit={20}
                enableCellChangeFlash={true}
                statusBar={statusBar}
                onCellValueChanged={onCellValueChanged}
                onGridReady={onGridReady}
            >
            </AgGridReact>
        </div>
    )
}
export const AgGrid = React.forwardRef(Grid);
AgGrid.displayName = 'AGGrid';
