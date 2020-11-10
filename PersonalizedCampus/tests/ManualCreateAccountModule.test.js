/**
 * @jest-environment jsdom
 */

import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount, render } from 'enzyme';
import ManualCreateAccountModule from '../components/manualCreateAccount'

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