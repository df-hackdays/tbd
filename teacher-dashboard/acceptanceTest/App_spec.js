import chai from 'chai'
import { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

describe('Test App page', () => {
	before(() => {
		browser.get('/')
	    browser.sleep(1000)
	})

    it('should display react logo', () => {
        expect($('img.App-logo').isPresent()).to.eventually.equal(true)
    })
})