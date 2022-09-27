import * as env from 'env-var';
import React, { useState, useRef, useImperativeHandle, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { GridReadyEvent } from 'ag-grid-community';
import { CellChangedEvent } from 'ag-grid-community/dist/lib/entities/rowNode';

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
    onCellValueChanged?: (e: CellChangedEvent) => void
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
                rowData={[]}
                rowSelection={'multiple'}
                singleClickEdit={true}
                statusBar={statusBar}
                onCellValueChanged={onCellValueChanged}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
            >
            </AgGridReact>
        </div>
    )
}
Grid.displayName = 'Grid';
export const AgGrid = React.forwardRef(Grid);
