import { RowNode } from 'ag-grid-community';
import Dexie, { Table, Transaction } from 'dexie';

export interface MockUp {
    rowId: number;     // rowId is only use for indexeddb. it's a indexed key.
    make?: string;
    model?: string;
    price?: number;
}

export enum GRID_TRANSACTION_TYPE {
    ADD = "add", UPDATE = "update", REMOVE = "remove"
}

export const foldr = <A, B>(f: (x: A, acc: B) => B, acc: B, [h, ...t]: A[]): B =>
    h === undefined ? acc : f(h, foldr(f, acc, t));

export const foldl = <A, B>(f: (x: A, acc: B) => B, acc: B, [h, ...t]: A[]): B =>
    h === undefined ? acc : foldl(f, f(h, acc), t);

export class MockUpDB extends Dexie {
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
        /**
         * Using this hook, integrate the datas between indexed DB and AG Grid
         */
        /**
         * creating hook is occured when execute the 'add' operator of Dexie' Table.
         */
        this.apps.hook('creating', (primKey: number, obj: MockUp, transaction: Transaction) => {
            this.grid.applyTransaction({ add: [obj] });
        });
        /**
         * creating hook is occured when execute the 'update' operator of Dexie' Table.
         */
        this.apps.hook('updating', (modification: Object, primKey: number, obj: MockUp, transaction: Transaction) => {
            let updated = Object.assign(obj, modification);
            this.grid.applyTransaction({ update: [updated] });
        });
        /**
         * creating hook is occured when execute the 'delete' operator of Dexie' Table.
         */
        this.apps.hook('deleting', (primKey: number, obj: MockUp, transaction: Transaction) => {
            /**
             * must pass the function of getRowId to AG Grid
             * to compare the obj when call the applyTransaction
             * 
             * it strongly needed when remove items from grid
             */
            this.grid.applyTransaction({ remove: [{ rowId: obj.rowId }] })
        });
    }

    /**
     * to integrate the remain datas in indexed DB with grid
     */
    integrateIndexedDbRowsToGrid = async () => {
        if (await this.apps.count() > 0) {
            const indexedDbRows = await this.apps.toArray();
            this.grid.applyTransaction({ add: indexedDbRows });
        }
    }

    /**
     * too add rowDatas into the indexed DB
     * if the data is existed, update
     * else the data is not existed, add
     * 
     * @param rows 
     */
    addRowDatas = (rowDatas: MockUp[]) => {
        this.transaction('rw', this.apps, async (transaction) => {
            // 1. indexedDb 에 확인한다.
            // 2. indexedDb 에 있고, grid 에 없으면 add items
            // 3. indexedDb 에 있고, grid 에 있으면 update items
            // 4. grid 에 transaction 을 적용한다. -> hook 을 이용
            rowDatas.forEach(async rowData => {
                const app = await this.apps.get(rowData.rowId);
                if (app) {
                    this.apps.update(app.rowId, rowData);
                } else {
                    this.apps.add(rowData);
                }
            })
        })
    }

    /**
     * delete 
     * 
     * @param rows 
     */
    deleteRowDatas = (selectedRows: RowNode[]) => {
        this.transaction('rw', this.apps, async (transaction) => {
            selectedRows.forEach(async selectedRow => {
                this.apps.delete(selectedRow.data.rowId);
            })
        })
    }

    updateRowData = (changedRow: MockUp) => {
        this.transaction('rw', this.apps, async (transaction) => {
            this.apps.update(changedRow.rowId, changedRow);
        })
    }

    updateCellData = (changedRow: MockUp) => {
        this.transaction('rw', this.apps, async (transaction) => {
            this.apps.update(changedRow.rowId, changedRow);
        })
    }
}
