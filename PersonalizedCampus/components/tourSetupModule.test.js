/**
 * @jest-environment jsdom
 */

import React from 'react';
import renderer from 'react-test-renderer';
import TourSetupComponent from '../components/tourSetup'
import { shallow, mount, configure, render } from 'enzyme';
import Enzyme from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import 'react-native-gesture-handler/jestSetup';

Enzyme.configure({ adapter: new Adapter() });

it('Testing Tour Creation with Valid Tour Title', () => {
    const context = { name: '' };
    const wrapper = mount(<TourSetupComponent />, { context });
    wrapper.setContext({tourTitle: 'A Title'});
    expect(wrapper).toBeTruthy();
  });