import "./styles.css";
import { AgGrid } from "./component/Grid";
import {useRef} from "react";


export default function App() {
    const testRef = useRef<any>(null);
    const test = () =>{
        console.log('testRef', testRef.current);
        console.log('getGridAPI', testRef.current.getGridApi())
    }
    return (
    <div className="App">
      <h1>Hello AG Grid</h1>
      <AgGrid
          ref={testRef}
      />
        <button onClick={test} />
    </div>
  );
}
