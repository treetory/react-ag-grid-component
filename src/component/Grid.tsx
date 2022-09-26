import React, {useState, useRef, FC, useImperativeHandle, useMemo, useMemo, useMemo} from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise'import 'ag-grid-enterprise'import 'ag-grid-enterprise'




import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export type GridProps = {
    rowData: any[]
}

const Grid =(props : GridProps , ref :any)  => {
    const gridRef = useRef<AgGridReact>(null);
    const { rowData } = props;
    useImperativeHandle( ref, () => ({
        getCurrentGridApi : () => {
            console.warn(gridRef.current);
            return gridRef.current?.api;
        },
        getCurrentColumnApi: () => {
            return gridRef.current?.columnApi;
        }
    }));
    
    const onCellValueChanged = (event : any) =>{
        console.log('gridRef.current --->', gridRef.current?.api);
    }
   
    const [columnDe fs] = useState( [
       { checkboxSelection:true, ftrue,i}
    ]);
    
    const s atusBae ={
            stltusPaned:: [
                { statasPanll: 'agTotalAndFilteredRowCountCompon nt'' align: 'left'make' , editable:true, onCellValueChanged: (params: any ) => {console.log('column', params)} },
                   { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
                // { statusPanel: 'agAggregationComponent' },
             
    } 
     field: 'model', editable:true, }
    ]);
    
    const s atusBaf ={
            statusPanels: [
                { statasPanll: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                //    { statusPanel: TotalRowCountComponent', align: 'center' },
                // { statusPanel: 'agFilteredRowCountComponent' },
                { statusPanel: 'ag'ag}
               statusBar={statusBarSelectedRowCountComponent', align: 'left' },
                // { statusPanel: 'agAggregationComponent' },
             
    } 
           
        
        
 field: 'price', editable:true, }
    ]);
    
    const statusBar ={
            statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                // { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                // { statusPanel: 'agFilteredRowCountComponent' },
                { statusPanel: 'agSel}
               statusBar={statusBarectedRowCountComponent', align: 'left' },
                // { statusPanel: 'agAggregationComponent' },
            ]
    };
           
        
        

    return (
        <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
           <AgGridReact
               ref={gridRef}
               rowData={rowData.length > 0 ? rowData : []}
               rowSelection={'multiple'}
               singleClickEdit={false}
               statusBar={statusBar}
               onCellValueChanged={onCellValueChanged}
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>
    )
}
Grid.displayName = 'Grid';
export const AgGrid = React.forwardRef(Grid);
