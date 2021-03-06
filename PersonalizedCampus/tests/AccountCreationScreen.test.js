/**
 * @jest-environment jsdom
 */

import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import AccountCreationScreen from '../screens/accountCreationScreen';
import * as firebase from 'firebase'
require('firebase/auth')
import { shallow, mount, configure, render } from 'enzyme';
import Enzyme from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
jest.mock('@react-navigation/native');


jest.mock('firebase', () => {
  return {
    initializeApp: jest.fn(() => {
      return {
        auth: jest.fn(() => {
          return {
            createUserWithEmailAndPassword: jest.fn((para1, para2) => {
              return new Promise(function(resolve, reject) {
                resolve({
                  email: 'test@test.com',
                  uid: '12345678abcdefg'
                });
                reject({ message: 'error!' });
              });
            }),
            signOut: jest.fn(() => {
              return new Promise(function(resolve, reject) {
                resolve('Success');
                reject({ message: 'error!' });
              });
            }),
            onAuthStateChanged: jest.fn(() => {
              return {
                email: 'test@test.com',
                uid: '12345678abcdefg'
              };
            }),
            signInWithEmailAndPassword: jest.fn((para1, para2) => {
              return new Promise(function(resolve, reject) {
                reject({ message: 'error!' });
              });
            }),
          };
        })
      };
    }),
    auth: jest.fn(() => {
      return {
        createUserWithEmailAndPassword: jest.fn((para1, para2) => {
          return new Promise(function(resolve, reject) {
            resolve({
              email: 'test@test.com',
              uid: '12345678abcdefg'
            });
            reject({ message: 'error!' });
          });
        }),
        signOut: jest.fn(() => {
          return new Promise(function(resolve, reject) {
            resolve('Success');
            reject({ message: 'error!' });
          });
        }),
        onAuthStateChanged: jest.fn(() => {
          return {
            email: 'test@test.com',
            uid: '12345678abcdefg'
          };
        }),
        signInWithEmailAndPassword: jest.fn((para1, para2) => {
          return new Promise(function(resolve, reject) {
            reject({ message: 'error!' });
          });
        }),
      };
    })
  };
});


jest.doMock('../screens/signedInScreen', () => {
  const SignedInScreen = () => <div />;
  return SignedInScreen;
});


it("Snapshot of Account Creation Screen", () => {
  const wrapper = shallow(<AccountCreationScreen />);
  expect(wrapper).toMatchSnapshot();
});