/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { shallow } from 'enzyme';
import SignedInScreen from '../screens/signedInScreen'
import TourCreationScreen from '../screens/tourCreationScreen';
import Button from '../components/button'
import * as firebase from 'firebase'
require('firebase/auth')

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

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("Map load", () => {
  act(() => {
    render(<TourCreationScreen anchor="null" />, container);
  });
  expect(container.textContent).toBe('Create a TourTour Name:Select general tour area:Loading...Create Tour');
});

describe('Test Missing Data Submission', () =>
it("Render Anchor Error", () => {
  const button = shallow((<Button title='button' onClick={createTour} />))
  button.find('button').simulate('click')
  expect(container.textContent).toBe('Please set a tour area title');
}));