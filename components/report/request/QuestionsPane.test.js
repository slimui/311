// @flow

import React from 'react';
import renderer from 'react-test-renderer';

import type { Service } from '../../../data/types';
import { AppStore } from '../../../data/store';

import QuestionsPane from './QuestionsPane';

export const DEFAULT_SERVICE: Service = {
  name: 'Cosmic Incursion',
  code: 'CSMCINC',
  hasMetadata: false,
  metadata: null,
};

export const SERVICE_WITH_METADATA: Service = {
  name: 'Cosmic Incursion',
  code: 'CSMCINC',
  hasMetadata: true,
  metadata: {
    attributes: [{
      required: false,
      type: 'TEXT',
      code: 'ST-CMTS',
      description: 'Please provide any other relevant information:',
      values: null,
      conditionalValues: null,
      dependencies: null,
    }],
  },
};

let store;

beforeEach(() => {
  store = new AppStore();
  store.currentService = DEFAULT_SERVICE;
});

test('blank request', () => {
  const component = renderer.create(
    <QuestionsPane store={store} nextFunc={jest.fn()} />,
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('existing description', () => {
  store.description = 'Please pick up my bulk items. ';

  const component = renderer.create(
    <QuestionsPane store={store} nextFunc={jest.fn()} />,
  );

  expect(component.toJSON()).toMatchSnapshot();
});

test('service with metadata', () => {
  store.currentService = SERVICE_WITH_METADATA;

  const component = renderer.create(
    <QuestionsPane store={store} nextFunc={jest.fn()} />,
  );

  expect(component.toJSON()).toMatchSnapshot();
});