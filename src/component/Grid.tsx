import * as env from 'env-var';
import React, { useState, useRef, useImperativeHandle, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const LICENSE_KEY: string = env.get('REACT_APP_AGGRID_LICENSE_KEY').required().asString();
LicenseManager.setLicenseKey(LICENSE_KEY);

export type GridProps = {
    rowData: any[],
    columnDefs: any[]
}

const Grid = (props: GridProps, ref: any) => {

    const { rowData, columnDefs } = props;

    const gridRef = useRef<AgGridReact>(null);

    useImperativeHandle(ref, () => ({
        getCurrentGridApi: () => {
            return gridRef.current?.api;
        },
        getCurrentColumnApi: () => {
            return gridRef.current?.columnApi;
        }
    }));

    const onCellValueChanged = (event: any) => {
        console.log('gridRef.current --->', gridRef.current?.api);
    }

    const statusBar = {
        statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
            { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
        ]
    };

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
            <AgGridReact
                ref={gridRef}
                rowData={rowData.length > 0 ? rowData : []}
                rowSelection={'multiple'}
                singleClickEdit={true}
                statusBar={statusBar}
                onCellValueChanged={onCellValueChanged}
                columnDefs={columnDefs}>
            </AgGridReact>
        </div>
    )
}
Grid.displayName = 'Grid';
export const AgGrid = React.forwardRef(Grid);
