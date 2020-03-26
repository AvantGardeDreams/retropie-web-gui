/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import NotFound from '../notFound/NotFound';
import Game from './Game';
import { findGameBySystem } from '../../helpers';

export const path = '/system/:system/:game';

export const action = async ({ params }) => {
  const metadata = findGameBySystem(params.system, params.game);
  if (!metadata) {
    return {
      title: 'Unknown',
      component: (<NotFound title={'Ups... nothing to show!'} { ...params } />),
    };
  }

  return {
    title: metadata.title,
    component: (<Game { ...params } />),
  };
};

export default {
  path,
  action
}
