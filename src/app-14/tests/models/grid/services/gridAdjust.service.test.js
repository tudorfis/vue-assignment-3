import { globalConfig as gc } from '../../../../config/global.config';
import { gridModel } from '../../../../models/grid/grid.model';
import { gridAdjustService } from '../../../../models/grid/services/gridAdjust.service';

describe('gridAdjustService', function () {
    beforeEach(() => {
        gridModel.model = { cells: {}, numCols: 9, numRows: 5 }
        gc.rowsFromTheEnd = 2
        gc.colsFromTheEnd = 2
    });

    test(`isNearColEnd()`, () => {
        expect(gridAdjustService.isNearColEnd('2-1')).toBe(false)
        expect(gridAdjustService.isNearColEnd('2-7')).toBe(false)
        expect(gridAdjustService.isNearColEnd('2-8')).toBe(true)
        expect(gridAdjustService.isNearColEnd('2-9')).toBe(true)
    })
    test(`isNearRowEnd()`, () => {
        expect(gridAdjustService.isNearRowEnd('2-1')).toBe(false)
        expect(gridAdjustService.isNearRowEnd('3-1')).toBe(false)
        expect(gridAdjustService.isNearRowEnd('4-1')).toBe(true)
        expect(gridAdjustService.isNearRowEnd('5-1')).toBe(true)
    })
    test(`addColAtEnd()`, () => {
        gridAdjustService.addColAtEnd()
        expect(gridModel.model.numCols).toBe(10)
        expect(gridModel.model.cells['1-11']).toBeFalsy()
        for (let i = 1; i <= 5; i++)
            expect(gridModel.model.cells[`${i}-10`]).toBeTruthy()
    })
    test(`addRowAtEnd()`, () => {
        gridAdjustService.addRowAtEnd()
        expect(gridModel.model.numRows).toBe(6)
        expect(gridModel.model.cells['7-2']).toBeFalsy()
        for (let i = 1; i <= 5; i++)
            expect(gridModel.model.cells[`6-${i}`]).toBeTruthy()
    })
})