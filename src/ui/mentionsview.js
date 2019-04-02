/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module mention/ui/mentionsview
 */

import View from '@ckeditor/ckeditor5-ui/src/view';
import ListView from '@ckeditor/ckeditor5-ui/src/list/listview';
import Rect from '@ckeditor/ckeditor5-utils/src/dom/rect';

import '../../theme/mentionui.css';

/**
 * The mention ui view.
 *
 * @extends module:ui/view~View
 */
export default class MentionsView extends View {
	/**
	 * @inheritDoc
	 */
	constructor( locale ) {
		super( locale );

		this.listView = new ListView( locale );

		this.setTemplate( {
			tag: 'div',

			attributes: {
				class: [
					'ck',
					'ck-mentions'
				],

				tabindex: '-1'
			},

			children: [
				this.listView
			]
		} );
	}

	/**
	 * {@link #select Selects} the first item.
	 */
	selectFirst() {
		this.select( 0 );
	}

	/**
	 * Selects next item to the currently {@link #select selected}.
	 *
	 * If the last item is already selected, it will select the first item.
	 */
	selectNext() {
		const item = this.selected;

		const index = this.listView.items.getIndex( item );

		this.select( index + 1 );
	}

	/**
	 * Selects previous item to the currently {@link #select selected}.
	 *
	 * If the first item is already selected, it will select the last item.
	 */
	selectPrevious() {
		const item = this.selected;

		const index = this.listView.items.getIndex( item );

		this.select( index - 1 );
	}

	/**
	 * Marks item at a given index as selected.
	 *
	 * Handles selection cycling when passed index is out of bounds:
	 * - if the index is lower than 0, it will select the last item,
	 * - if the index is higher than the last item index, it will select the first item.
	 *
	 * @param {Number} index Index of an item to be marked as selected.
	 */
	select( index ) {
		let indexToGet = 0;

		if ( index > 0 && index < this.listView.items.length ) {
			indexToGet = index;
		} else if ( index < 0 ) {
			indexToGet = this.listView.items.length - 1;
		}

		const item = this.listView.items.get( indexToGet );
		item.highlight();

		// Scroll the mentions view to the selected element.
		if ( !this._isItemVisibleInScrolledArea( item ) ) {
			this.element.scrollTop = item.element.offsetTop;
		}

		if ( this.selected ) {
			this.selected.removeHighlight();
		}

		this.selected = item;
	}

	/**
	 * Triggers the `execute` event on the {@link #select selected} item.
	 */
	executeSelected() {
		this.selected.fire( 'execute' );
	}

	// Checks if an item is visible in the scrollable area.
	//
	// The item is considered visible when:
	// - its top boundary is inside the scrollable rect
	// - its bottom boundary is inside the scrollable rect (the whole item must be visible)
	_isItemVisibleInScrolledArea( item ) {
		return new Rect( this.element ).contains( new Rect( item.element ) );
	}
}