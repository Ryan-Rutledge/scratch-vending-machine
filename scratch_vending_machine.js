/******************************
 * Vendimg Machine Controller
 *****************************/

/**
 * Creates a new Scratch Vending Machine (SVM).
 * @param {Object} container DOM element to contain vending machine gui.
 * @class
 */ function ScratchVendingMachine(container) {
	this.gui = new ScratchVendingMachineGUI();
	this.gui.container(container);
	this.gui.disableSlotClick(true);

	this._slots = [ {}, {}, {} ];
	this.currency(0);
	this.takeRefund();
	this.currency(0);
	this.dispensed(null, null);
}

/**
 * Gets or sets currency within SVM.
 * @param {number} [currency] If supplied, will become new currency within SVM.
 * @return {number|Object} If a new currency value is supplied, returns
 *   the current SVM object. Otherwise, the current currency within the SVM.
 */
ScratchVendingMachine.prototype.currency = function(currency) {
	if (currency === undefined) {
		return this.currency._get.call(this);
	}
	else {
		this.currency._set.call(this, currency);
		return this;
	}
};

/**
 * Gets currency within SVM
 * @private
 * @returns {number} New currency within SVM.
 */
ScratchVendingMachine.prototype.currency._get = function() {
	return this._currency;
};

/**
 * Sets currency within SVM
 * @private
 * @param {number} currency New currency within SVM.
 */
ScratchVendingMachine.prototype.currency._set = function(currency) {
	this._currency = currency;
	this.gui.currency(currency);
};

/**
 * Removes currency from SVM and shows refund animation.
 * @return {number} Currency in SVM before refund.
 */
ScratchVendingMachine.prototype.refund = function() {
	this._refund = this.currency();
	this.currency(0);

	this.gui.refund(this._refund);

	return this._refund;
};

/**
 * Removes refund money from SVM
 * @return {number} Refund amount.
 */
ScratchVendingMachine.prototype.takeRefund = function() {
	var refund = this._refund;
	this._refund = 0;

	this.gui.takeRefund();

	return refund;
};


/**
 * Gets or sets state value of SVM.
 * @param {string} [state] If supplied, will become new state of SVM
 * @param {string} [loop=true] If supplied, a new loop will begin after state
     is set.
 * @return {string|Object} If a new state value is supplied, returns
 *   the current SVM object. Otherwise, the current state of the SVM.
 */
ScratchVendingMachine.prototype.state = function(state, loop) {
	if (state === undefined) {
		return this.state._get.call(this);
	}
	else {
		this.state._set.call(this, state);

		if (loop || loop === undefined) {
			this._next();
		}
		return this;
	}
};

/**
 * Gets state of SVM
 * @private
 * @returns {string} Current state of SVM.
 */
ScratchVendingMachine.prototype.state._get = function() {
	return this._state;
};

/**
 * Sets new state of SVM and initiates logic loop
 * @private
 * @param {string} state New State of SVM.
 */
ScratchVendingMachine.prototype.state._set = function(state) {
	this._state = state;
	this.gui.state(state);
};

/**
 * Tells the user something.
 * @param {string} message Prompt to show user.
 * @param {function} [callback] Called after answer goes away
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.say = function(message, callback) {
	this.gui.say(message, callback);
};

/**
 * Asks user a question.
 * @param {string} Question Prompt to show user.
 * @param {askCallback} callback Called after an answer is supplied.
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.ask = function(question, callback) {
	var self = this;

	self.gui.ask(question, function(answer) {
		self.answer(answer);
		self.gui.disableSlotClick(true);
		callback(answer);
	});

	return self;
};

/**
 * Gets the most recent answer to ask function.
 * @private
 * @param [string] answer
 * @return {string|Object} If no argument is provided,returns the most recent
 *   question or null if no questions have been asked yet. If a new
 *   answer is given, returns the current SVM object.
 */
ScratchVendingMachine.prototype.answer = function(answer) {
	if (answer === undefined) {
		return this.answer._get.call(this);
	}
	else {
		this.answer._set.call(this, answer);
		return this;
	}
};

/**
 * Gets the most recent answer to ask function.
 * @private
 * @return {string} Answer to most recent question, or null if no questions
 *   have been asked yet.
 */
ScratchVendingMachine.prototype.answer._get = function() {
	return this._answer;
};

/**
 * Sets the most recent answer to ask function.
 * @private
 * @param {string} answer Answer to most recent question.
 */
ScratchVendingMachine.prototype.answer._set = function(answer) {
	this._answer = answer;
};

/**
 * Handler for a SVM ask() function..
 * @callback askCallback
 * @param {string} answer User reply to question..
 */

/**
 * Gets item count or puts a new item into slot.
 * @param {number|string} slotIdentifier Slot index.starting at 0, or name of slot.
 * @param {number} [count] Number of items to set in slot.
 * @param {string} [name] New name to assign item.
 * @param {string} [src] Image source to use as slot icon.
 * @param {string} [price] Price of one item in slot.
 * @return {Object} If only an identifier is provided, an object containing
 *   name and count keys is returned. Otherwise, returns the current SVM object.
 */
ScratchVendingMachine.prototype.slot = function(slotIdentifier, count, name, src, price) {
	if (count === undefined) {
		return this.slot._get.call(this, slotIdentifier);
	}
	else {
		this.slot._set.call(this, slotIdentifier, count, name, src, price);
		return this;
	}
};

/**
 * Gets the number items in a specified slot.
 * @private
 * @param {number|string} slotIdentifier Slot index starting at 0, or slot name.
 * @return {Object} An object with count and name keys.
 */
ScratchVendingMachine.prototype.slot._get = function(slotIdentifier) {
	var index = isNaN(slotIdentifier) ? this.slot._get.byName.call(this, slotIdentifier) : slotIdentifier;
	var slot = this._slots[index] || {};

	return {
		name: slot.name,
		count: slot.count,
		src: slot.src,
		price: slot.price,
		index: slot.name === undefined ? undefined : index
	};
};

/**
 * Gets the number items in a specified slot.
 * @private
 * @param {number|string} Name of slot
 * @return {number} Index of slot.
 */
ScratchVendingMachine.prototype.slot._get.byName = function(name) {
	for (var i in this._slots) {
		if (this._slots[i].name === name) {
			return i;
		}
	}
};

/**
 * Sets the item info for a specified slot.
 * @private
 * @param {number|string} slotIdentifier Slot index starting at 0 or slot name.
 * @param {number} count Number of items to place into slot.
 * @param {string} [name] Name of new item to place in slot..
 * @param {string} [src] Image source to use as slot icon.
 * @param {string} [price] Slot item price.
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.slot._set = function(slotIdentifier, count, name, src, price) {
	var index = isNaN(slotIdentifier) ? this.slot._get.call(this, slotIdentifier).index : slotIdentifier;
	var slot = this._slots[index];

	slot.name = name || slot.name;
	slot.src = src || slot.src;
	slot.count = count === undefined ? slot.count : count;
	slot.price = price === undefined ? slot.price : price;

	this.gui.slot(index, slot);

	return this;
};

/**
 * Sets a callback function to be called when a slot is clicked.
 * @private
 * @param {clickCallback} callback Slot click event callback.
 */
ScratchVendingMachine.prototype.slot._click = function(callback) {
	var self = this;
	
	self.gui.disableSlotClick(false);
	self.gui.slotClick(function(index) {
		self._clickedSlot = index;
		self.gui.disableSlotClick(true);
		callback(self.slot(index));
	});
};

/**
 * Sets a callback function to be called when a slot is clicked.
 * @private
 * @param {clickCallback} callback Slot click event callback.
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.click = function(callback) {
	this.slot._click.call(this, callback);
	return this;
};

/**
 * Gets last clicked slot
 * @private
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.clicked = function() {
	return this.slot(this._clickedSlot);
}

/**
 * Handler for a SVM slot clock event.
 * @callback clickCallback
 * @param {Object} slot Object with slot count and name keys.
 */

/**
 * Dispenses an item from a slot into the dispenser.
 * @param {number} slotIdentifier Slot to dispense item from.
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.dispense = function(slotIdentifier) {
	var index = this.slot(slotIdentifier).index;

	// Set new slot info
	var slot = this.slot(index);
	this.dispensed(slot.name, slot.src);

	// Dispense from gui
	this.gui.dispense(slot.src);

	return this;
};

/**
 * Gets or sets dispenser item.
 * @private
 * @param {String} [name] Name of item to put in dispenser.
 * @param {String} [src] Image source of item to put in dispenser.
 * @return {Object} If name and src are not provided, returns the
 *   name and src of item in dispenser. Both items will be null if dispenser is
 *   empty. If parameters are provided, sets dispenser item and returns the
 *   current SVM object.
 */
ScratchVendingMachine.prototype.dispensed = function(name, src) {
	if (name === undefined || src === undefined) {
		var item = this.dispensed._get.call(this);
		return item.name === null ? null:item;
	}
	else {
		this.dispensed._set.call(this, name, src);
		return this;
	}
};

/**
 * Gets name of item in dispenser.
 * @private
 * @return {Object|undefined} Name and image source of item in dispenser,
 *   or undefined if empty.
 */
ScratchVendingMachine.prototype.dispensed._get = function() {
	return {
		name: this._dispensedItem.name,
		src: this._dispensedItem.src
	};
};

/**
 * rets name of item in dispenser.
 * @private
 * @param {String} name Name of item to put in dispenser.
 * @param {String} src Image source of item to put in dispenser.
 */
ScratchVendingMachine.prototype.dispensed._set = function(name, src) {
	this._dispensedItem = {
		name: name,
		src: src
	};
};

/**
 * Removes an item from the dispenser.
 * @return {Object} Item name and source, or undefined if dispenser is empty.
 */
ScratchVendingMachine.prototype.takeItem = function() {
	var dispensedItem = this.dispensed();

	this.gui.takeItem();
	this.dispensed(null, null);

	return dispensedItem;
};

/**
 * Sets vending machine logic loop.
 * @param {svmCallback} callback This is the core logic loop of the svm
 *   object. It is called after every state change.
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.loop = function(callback) {
	this._loop = callback;
	return this;
};

/**
 * Logic loop for SVM.
 * @callback svmCallback
 * @param {Object} svm Scratch Vendimg Machine object.
 */

/**
 * Initiates logic loop
 * @private
 */
ScratchVendingMachine.prototype._next = function() {
	if (this._loop) {
		this._loop(this);
	}
};

/**
 * Gets SVM info as json.
 * @return {Object} 
 */
ScratchVendingMachine.prototype.json = function() {
	return {
		state: this.state(),
		answer: this.answer(),
		currency: this.currency(),
		dispenser: this.dispensed(),
		slots: [
			this.slot(0),
			this.slot(1),
			this.slot(2)
		]
	};
};
