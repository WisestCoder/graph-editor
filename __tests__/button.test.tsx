import React from 'react';
import { mount } from 'enzyme';
import Component from '../src';

describe('Test component', () => {

  it('should be called on click', () => {
    const clickFunc = jest.fn(() => { console.log(1); });

    const calculator = mount(<Component onClick={clickFunc} />);

    calculator.simulate('click');
    expect(clickFunc).toHaveBeenCalled();
  });
});
