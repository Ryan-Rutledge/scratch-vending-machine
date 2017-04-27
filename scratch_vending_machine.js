/******************************
 * Vendimg Machine Controller
 *****************************/

/**
 * Creates a new Scratch Vending Machine (SVM).
 * @param {Object} container DOM element to contain vending machine gui.
 * @class
 */
function ScratchVendingMachine(container) {
	var self = this;

	self.gui = new ScratchVendingMachineGUI(container);

	self._slots = [ {}, {}, {} ];
	self.currency(0);
	self.takeRefund();
	self.currency(0);
	self.dispensed(null, null);
}

/**
 * Turns the vms on or off.
 * @param {bool} [on=true] - Turns on if true, off otherwise.
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.init = function(on) {
	this.gui.init(on === undefined ? false : !on);

	return this;
};

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
 * Gets or sets svm refund amount.
 * @return {number} [amount] Refund amount.
 */
ScratchVendingMachine.prototype.refund = function(amount) {
	if (amount) {
		this._refund = amount;
		this.gui.refund();
		this.currency(this.currency() - amount);
	}
	else {
		return this._refund;
	}
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
 * @param {string} [message] Prompt to show user. If not supplied, hides previous message.
 * @param {number} [timeout] Number of milliseconds to wait before hiding text.
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.say = function(message, timeout) {
	var self = this;
	self.gui.say(message);

	if (timeout) {
		setTimeout(function() {
			self.say();
		}, timeout);
	}

	return self;
};

/**
 * Gets or sets the most recent reply.
 * @private
 * @param [string] reply
 * @return {string} If no argument is provided,returns the most recent
 *   reply.
 */
ScratchVendingMachine.prototype.reply = function(reply) {
	if (reply === undefined) {
		return this.reply._get.call(this);
	}
	else {
		this.reply._set.call(this, reply);
		return this;
	}
};

/**
 * Gets the most recent reply to ask function.
 * @private
 * @return {string} Most recent input.
 *   have been asked yet.
 */
ScratchVendingMachine.prototype.reply._get = function() {
	return this._reply;
};

/**
 * Sets the most recent reply to ask function.
 * @private
 * @param {string} reply Most recent input.
 */
ScratchVendingMachine.prototype.reply._set = function(reply) {
	this._reply = reply;
};

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
 * Gets and/or sets last clicked slot.
 * @private
 * @return {Object} The current SVM object.
 */
ScratchVendingMachine.prototype.clicked = function(slot) {
	if (slot && slot['index'] !== undefined) {
		this._clickedSlot = slot['index'];
	}

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
	var self = this;
	self._next(callback);

	// Refund click event
	self.gui.refundAction(function() {
		self.reply('refund');
		self._next.call(self);
	});

	// Slot click event
	self.gui.slotAction(function(soda) {
		self.reply('soda');
		self.clicked(self.slot(soda));
		self._next.call(self);
	});

	// Insert click event
	self.gui.insertAction(function(amount) {
		self.reply(amount);
		self._next.call(self);
	});

	// Dispenser click event
	self.gui.dispenserAction(function() {
		self.reply('dispense');
		self._next.call(self);
	});

	// Take refund click event
	self.gui.takeRefundAction(function() {
		self.reply('cash');
		self._next.call(self);
	});

	return self;
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
ScratchVendingMachine.prototype._next = function(loop) {
	if (loop) {
		this._loop = loop;
	}
	else if (this._loop) {
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
		reply: this.reply(),
		currency: this.currency(),
		dispenser: this.dispensed(),
		slots: [
			this.slot(0),
			this.slot(1),
			this.slot(2)
		]
	};
};
