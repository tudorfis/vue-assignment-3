import { globalConfig as gc } from '../../../../config/global.config';
import { gridModel } from '../../../../models/grid/grid.model';
import { gridAdjustService } from '../../../../models/grid/services/gridAdjust.service';

describe('gridAdjustService', function () {
    beforeEach(() => {
        gridModel.model = { cells: {}, numCols: 9, numRows: 5 }
        gc.rowsFromTheEnd = 2
        gc.colsFromTheEnd = 2
    });

    test(`nearColEnd()`, () => {
        expect(gridAdjustService.nearColEnd('2-1')).toBe(false)
        expect(gridAdjustService.nearColEnd('2-7')).toBe(false)
        expect(gridAdjustService.nearColEnd('2-8')).toBe(true)
        expect(gridAdjustService.nearColEnd('2-9')).toBe(true)
    })
    test(`nearRowEnd()`, () => {
        expect(gridAdjustService.nearRowEnd('2-1')).toBe(false)
        expect(gridAdjustService.nearRowEnd('3-1')).toBe(false)
        expect(gridAdjustService.nearRowEnd('4-1')).toBe(true)
        expect(gridAdjustService.nearRowEnd('5-1')).toBe(true)
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