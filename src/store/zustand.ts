import { create } from "zustand";

const useExcelStore = create((set) => ({
  currentCell: { rowIndex: 1, columnIndex: 1 },
  tableValues: Array.from({ length: 10000 }, () => Array(10000).fill("")),


  setCurrentCell: (rowIndex: number, columnIndex: number) =>
    set(() => ({ currentCell: { rowIndex, columnIndex } })),

  setCellValue: (rowIndex: number, columnIndex: number, value: string) =>
    set((state) => {
      const newTableValues = [...state.tableValues];
      newTableValues[rowIndex] = [...newTableValues[rowIndex]];
      newTableValues[rowIndex][columnIndex] = value;
      return { tableValues: newTableValues };
    }),
}));

export default useExcelStore;

export function numberToExcelColumn(n: number): string {
  let columnName = "";
  while (n >= 0) {
    let remainder = n % 26;
    columnName =
      String.fromCharCode(remainder + "A".charCodeAt(0)) + columnName;
    n = Math.floor(n / 26) - 1;
  }
  return columnName;
}
