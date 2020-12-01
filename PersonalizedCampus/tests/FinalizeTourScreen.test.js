/**
 * @jest-environment jsdom
 */

import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import FinalizeTourScreen from '../screens/finalizeTourScreen';
import SignedInScreen from '../screens/signedInScreen'
import * as firebase from 'firebase'
require('firebase/auth')
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';

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

jest.mock('@react-navigation/drawer', () => {
    return { createDrawerNavigator: jest.fn(() => {
        return;
    })
    }
});


jest.doMock('../screens/signedInScreen', () => {
    const signedInMock = () => <div />;
    return signedInMock;
});

it("Snapshot of Finalize Tour Screen", () => {
  const wrapper = shallow(<FinalizeTourScreen />);
  expect(wrapper).toMatchSnapshot();
});