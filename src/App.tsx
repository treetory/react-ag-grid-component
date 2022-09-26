import "./styles.css";
import { AgGrid } from "./component/Grid";
import {useRef} from "react";


export default function App() {
    
    const rowData: any[] = [
        {make: "Toyota", model: "Celica", price: 35000},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxster", price: 72000}
    ];

    const gridRef = useRef<any>(null);
    const applyTransaction = () => { 
        const gridApi = gridRef.current?.getCurrentGridApi();
        gridApi.applyTransaction(
            {
                add: 
                    [
                        {make: "Hyundai", model: "Grandeur", price: 15000},
                        {make: "KIA", model: "K9", price: 12000},
                        {make: "Tesla", model: "Model3", price: 92000}
                    ]
            }
        );
    }
    
    const setColumnDef = () => {
        
    }
    
    return (
    <div className="App">
        <h1>Hello AG Grid</h1>
        <AgGrid
            ref={gridRef}
            rowData={rowData}
        />
        <span>
            <button onClick={applyTransaction}>applyTransaction</button>
            <button onClick={setColumnDef}>setColumnDef</button>
        </span>
    </div>
  );
}
