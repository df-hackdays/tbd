import React from 'react'
import { shallow } from 'enzyme'
import App from '../src/App'
import { expect } from 'chai'

describe('App tests', () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<App/>)
        expect(wrapper.find('.App').exists()).to.be.true
    })
})