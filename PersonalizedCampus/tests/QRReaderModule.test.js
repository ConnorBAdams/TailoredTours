/**
 * @jest-environment jsdom
 */

import React from 'react';
import renderer from 'react-test-renderer';
import QRReader from '../components/qrReader'
import { shallow, mount, configure, render } from 'enzyme';
import Enzyme from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import 'react-native-gesture-handler/jestSetup';

Enzyme.configure({ adapter: new Adapter() });

it('Testing Camera Permission', () => {
    const context = { name: '' };
    const wrapper = mount(<QRReader />, { context });
    wrapper.setContext({hasPermission: true});
    expect(wrapper.contains(<Text>No access to camera</Text>)).toBeFalsy();
  });