/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module pdf/pdf
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import HREditing from './hr/hrediting';
import HRUI from './hr/hrui';

import '../theme/hr.less';

export default class HRPlugin extends Plugin {
  /**
   * @inheritDoc
   */
  static get requires() {
    return [HRUI, HREditing];
  }

  /**
   * @inheritDoc
   */
  static get pluginName() {
    return 'HR';
  }
}
