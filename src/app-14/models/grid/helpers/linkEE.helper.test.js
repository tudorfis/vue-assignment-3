import linkEEhelper from './linkEE.helper'
import { gridModel } from '../grid.model'

describe('linkEEhelper', function () {
    test('generateEEpath()', () => {
        gridModel.model = {
            links: [
                "1-3__3-2",
                "2-1__2-4",
                "2-1__1-3",
                "3-2__2-4",
                "4-2__2-1",
                "2-1__2-4",
                "2-1__4-2",
                "1-3__2-1",
                "1-3__2-4"
            ]
        }
        
        linkEEhelper.generateEEpath()

        expect(linkEEhelper.eePathMap).toEqual({
            "1-3": { h: 3, v: 1 },
            "1-2": { h: 2, v: 1 },
            "2-2": { h: 4, v: 2 },
            "3-2": { h: 1, v: 2 },
            "2-1": { h: 4, v: 2 },
            "2-3": { h: 3, v: 1 },
            "2-4": { h: 2, v: 2 },
            "3-3": { h: 1, v: 0 },
            "3-4": { h: 1, v: 1 },
            "4-2": { h: 1, v: 1 },
            "4-1": { h: 1, v: 1 },
            "3-1": { h: 0, v: 1 },
            "1-1": { h: 1, v: 1 },
            "1-4": { h: 1, v: 1 }
        })
    })
})