/**
 * @jest-environment jsdom
 */

import React from 'react';
import renderer from 'react-test-renderer';
import ManualCreateAccountModule from '../components/manualCreateAccount'
import { shallow, mount, configure, render } from 'enzyme';
import Enzyme from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

it('Testing Password Matching', () => {
    const context = { name: 'foo' };
    const wrapper = mount(<ManualCreateAccountModule />, { context });
    wrapper.setContext({password: 'password'});
    wrapper.setContext({confirmPassword: '1234'})
    expect(wrapper.verifyPassword).toBeFalsy();
  });

it('Testing Email Validness', () => {
    const context = { name: '' };
    const wrapper = mount(<ManualCreateAccountModule />, { context });
    wrapper.setContext({email: ''});
    expect(wrapper.validEmail).toBeFalsy();
  });