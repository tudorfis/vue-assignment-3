import { LinkKeyIterator } from '../../../../models/grid/iterators/LinkKeyIterator'

describe('LinkKeyIterator', function () {
  test(`LINKS = ['1-1__1-2', '1-2__1-3', '1-4__1-5']`, () => {
    const links = ['1-1__1-2', '1-2__1-3', '1-4__1-5']
    const lki = new LinkKeyIterator(links)
    
    expect( lki.items ).toBe( links )
    expect( lki.stop ).toBe( false )
    expect( lki.i ).toBe( 0 )
    expect( lki.item ).toBe( null )
    expect( lki.length ).toBe( 3 )
    
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-1__1-2' )
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-2__1-3' )
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-4__1-5' )
    expect( lki.continue ).toBe( false )

    expect( lki.i ).toBe( 3 )
    expect( lki.stop ).toBe( true )
  })

  test(`LINKS = ['1-1__1-2', null, '1-4__1-5']`, () => {
    const links = ['1-1__1-2', null, '1-4__1-5']
    const lki = new LinkKeyIterator(links)
    
    expect( lki.items ).toBe( links )
    expect( lki.stop ).toBe( false )
    expect( lki.i ).toBe( 0 )
    expect( lki.item ).toBe( null )
    expect( lki.length ).toBe( 3 )
    
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-1__1-2' )
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-4__1-5' )
    expect( lki.continue ).toBe( false )

    expect( lki.i ).toBe( 3 )
    expect( lki.stop ).toBe( true )
  })

  test(`LINKS = ['1-1__1-2', null, null, null, '1-4__1-5']`, () => {
    const links = ['1-1__1-2', null, null, null, '1-4__1-5']
    const lki = new LinkKeyIterator(links)
    
    expect( lki.items ).toBe( links )
    expect( lki.stop ).toBe( false )
    expect( lki.i ).toBe( 0 )
    expect( lki.item ).toBe( null )
    expect( lki.length ).toBe( 5 )
    
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-1__1-2' )
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-4__1-5' )
    expect( lki.continue ).toBe( false )

    expect( lki.i ).toBe( 5 )
    expect( lki.stop ).toBe( true )
  })

  test(`LINKS = ['1-1__1-2', null, 0, '1-3__3-1', undefined, '1-4__1-5']`, () => {
    const links = ['1-1__1-2', null, 0, '1-3__3-1', undefined, '1-4__1-5']
    const lki = new LinkKeyIterator(links)
    
    expect( lki.items ).toBe( links )
    expect( lki.stop ).toBe( false )
    expect( lki.i ).toBe( 0 )
    expect( lki.item ).toBe( null )
    expect( lki.length ).toBe( 6 )
    
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-1__1-2' )
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-3__3-1' )
    expect( lki.continue ).toBe( true )
    expect( lki.linkKey ).toBe( '1-4__1-5' )
    expect( lki.continue ).toBe( false )

    expect( lki.i ).toBe( 6 )
    expect( lki.stop ).toBe( true )
  })

  test(`LINKS = [null, undefined]`, () => {
    const links = [null, undefined]
    const lki = new LinkKeyIterator(links)
    
    expect( lki.items ).toBe( links )
    expect( lki.stop ).toBe( false )
    expect( lki.i ).toBe( 0 )
    expect( lki.item ).toBe( null )
    expect( lki.length ).toBe( 2 )
    
    expect( lki.continue ).toBe( false )

    expect( lki.i ).toBe( 2 )
    expect( lki.stop ).toBe( true )
  })

  test(`LINKS = []`, () => {
    const links = []
    const lki = new LinkKeyIterator(links)
    
    expect( lki.items ).toEqual( [] )
    expect( lki.stop ).toBe( true )
    expect( lki.i ).toBe( 0 )
    expect( lki.item ).toBe( null )
    expect( lki.length ).toBe( 0 )
    expect( lki.continue ).toBe( false )
  })

  test(`LINKS = 'asd'`, () => {
    const links = 'asd'
    const lki = new LinkKeyIterator(links)
    
    expect( lki.items ).toEqual( [] )
    expect( lki.stop ).toBe( true )
    expect( lki.i ).toBe( 0 )
    expect( lki.item ).toBe( null )
    expect( lki.length ).toBe( 0 )
    expect( lki.continue ).toBe( false )
  })
  
  test(`LINKS = 2`, () => {
    const links = 2
    const lki = new LinkKeyIterator(links)
    
    expect( lki.items ).toEqual( [] )
    expect( lki.stop ).toBe( true )
    expect( lki.i ).toBe( 0 )
    expect( lki.item ).toBe( null )
    expect( lki.length ).toBe( 0 )
    expect( lki.continue ).toBe( false )
  })
  
  test(`LINKS = true`, () => {
    const links = true
    const lki = new LinkKeyIterator(links)
    
    expect( lki.items ).toEqual( [] )
    expect( lki.stop ).toBe( true )
    expect( lki.i ).toBe( 0 )
    expect( lki.item ).toBe( null )
    expect( lki.length ).toBe( 0 )
    expect( lki.continue ).toBe( false )
  })
  
})

