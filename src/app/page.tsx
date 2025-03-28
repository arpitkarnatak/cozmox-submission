"use client";

import useExcelStore, { numberToExcelColumn } from "@/store/zustand";
import { ReactElement, ReactNode } from "react";

import { AutoSizer, Grid, GridCellProps, MultiGrid } from "react-virtualized";

import React from "react";

export default function Home() {
  const { tableValues, setCurrentCell, setCellValue, currentCell } =
    useExcelStore();
  
  const cellRenderer = React.useCallback(
    ({ columnIndex, rowIndex, key, style }: GridCellProps) => {
      const isHeader = rowIndex === 0 || columnIndex === 0;
      const cellValue = tableValues[rowIndex]?.[columnIndex] || "";

      return (
        <div
          key={key}
          style={style}
          className={`border-[0.25px] flex items-center justify-center text-sm `}
          onClick={() => setCurrentCell(rowIndex, columnIndex)}
        >
          {/* Column headers (A, B, C, ...) */}
          {rowIndex === 0 && columnIndex > 0 && (
            <strong>{numberToExcelColumn(columnIndex - 1)}</strong>
          )}
          {/* Row headers (1, 2, 3, ...) */}
          {columnIndex === 0 && rowIndex > 0 && <strong>{rowIndex}</strong>}
          {/* Editable cell */}
          {!isHeader && (
            <input
              className="w-full h-full px-1 text-center border-none outline-none "
              defaultValue={cellValue}
              onBlur={(e) =>
                setCellValue(rowIndex, columnIndex, e.target.value)
              } // Save on blur
            />
          )}
        </div>
      );
    },
    [tableValues, setCurrentCell, setCellValue, currentCell]
  );

  return (
    <div className="w-full h-screen p-4">
      <div className="border border-gray-300 rounded-xl p-4 flex items-center gap-4 bg-white">
        <p className="p-2 border w-fit rounded-lg bg-gray-200 text-sm">
          {numberToExcelColumn(currentCell.columnIndex - 1)}
          {currentCell.rowIndex}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCellValue(
              currentCell.rowIndex,
              currentCell.columnIndex,
              tableValues[currentCell.rowIndex]
            );
          }}
        >
          <input
            className="border rounded-lg p-1 text-sm"
            value={
              tableValues[currentCell.rowIndex][currentCell.columnIndex] || ""
            }
            onChange={(e) =>
              setCellValue(
                currentCell.rowIndex,
                currentCell.columnIndex,
                e.target.value
              )
            }
          />
        </form>
      </div>
      <div className="w-full h-full">
        <AutoSizer>
          {({ height, width }) => (
            <MultiGrid
              fixedColumnCount={1}
              fixedRowCount={1}
              cellRenderer={cellRenderer}
              columnCount={10000}
              rowCount={10000}
              columnWidth={120}
              rowHeight={30}
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
