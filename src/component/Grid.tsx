import React, {useState, useRef, FC, useImperativeHandle} from 'react';
import { AgGridReact } from 'ag-grid-react';


import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// export type GridProps = {
//     ref : any,
// }

const Grid =(props : any , ref :any)  => {
    const gridRef = useRef<AgGridReact>(null);

    useImperativeHandle( ref, () => ({
        getGridApi : () => {
            return gridRef.current;
        },
    }));
    
    const [rowData] = useState([
       {make: "Toyota", model: "Celica", price: 35000},
       {make: "Ford", model: "Mondeo", price: 32000},
       {make: "Porsche", model: "Boxster", price: 72000}
    ]);

    const onCellValueChanged = (event : any) =>{
        console.log('gridRef.current --->', gridRef.current);
    }
   
    const [columnDefs] = useState([
       { field: 'make' , editable:true, onCellValueChanged: (params: any ) => {console.log('column', params)} },
       { field: 'model', editable:true, },
       { field: 'price', editable:true, }
    ]);

    return (
        <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
           <AgGridReact
               ref={gridRef}
               rowData={rowData}
               onCellValueChanged={onCellValueChanged}
               columnDefs={columnDefs}>
           </AgGridReact>
       </div>
    )
}
Grid.displayName = 'Grid';
export const AgGrid = React.forwardRef(Grid);
