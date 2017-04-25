/******************************
 * Vendimg Machine GUI
 *****************************/

/**
 * Displays vending machine gui.
 * @class
 */
function ScratchVendingMachineGUI(container) {
	var self = this;
	var gui = container;
	self.elem = {
		gui: gui,
		state: gui.getElementsByClassName('svm_state')[0],
		input: gui.getElementsByClassName('svm_input')[0],
		answer: gui.getElementsByClassName('svm_answer_box')[0],
		prompt: gui.getElementsByClassName('svm_prompt')[0],
		submit: gui.getElementsByClassName('svm_submit')[0],
		refund: gui.getElementsByClassName('svm_refund')[0],
		refundBtn: gui.getElementsByClassName('svm_refund_btn')[0],
		refundMoney: gui.getElementsByClassName('svm_refund_money')[0],
		question: gui.getElementsByClassName('svm_question')[0],
		currency: gui.getElementsByClassName('svm_currency')[0],
		dispenser: gui.getElementsByClassName('svm_dispenser')[0],
		dispenserItem: gui.getElementsByClassName('svm_dispenser_img')[0],
		slots: gui.getElementsByClassName('svm_slot_button'),
		slotName: gui.getElementsByClassName('svm_slot_name'),
		slotImage: gui.getElementsByClassName('svm_slot_img'),
		slotCount: gui.getElementsByClassName('svm_slot_count'),
		slotPrice: gui.getElementsByClassName('svm_slot_price'),
		coins: gui.getElementsByClassName('svm_money')
	};

	function submitAnswerHandler() {
		self.elem.prompt.style = '';

		if (self._answerHandler) {
			self._answerHandler();
		}
	}

	self.elem.submit.addEventListener('click', function(e) {
		submitAnswerHandler();
	});
	self.elem.input.addEventListener('keypress', function(e) {
		if (e.keyCode === 13) submitAnswerHandler();
	});
}

ScratchVendingMachineGUI.prototype.ANIMATE_TIMEOUT = 2000;
ScratchVendingMachineGUI.prototype.SLOT_COUNT = 3;
ScratchVendingMachineGUI.prototype.COIN_COUNT = 4;
ScratchVendingMachineGUI.prototype.TEMPLATE = document.createElement('div');
ScratchVendingMachineGUI.prototype.TEMPLATE.className = 'svm_container';
ScratchVendingMachineGUI.prototype.TEMPLATE.innerHTML = 

/**
 * Applies a function to all slot elements.
 * @private
 * @param {function} callback.- Action to do to each slot. Passed elem.
 */
ScratchVendingMachineGUI.prototype._eachSlot = function(callback) {
	for (var i = 0; i < ScratchVendingMachineGUI.prototype.SLOT_COUNT; i++) {
		callback(this.elem.slots[i]);
	}
};

/**
 * Applies a function to all coin elements.
 * @private
 * @param {function} callback.- Action to do to each coin. Passed elem.
 */
ScratchVendingMachineGUI.prototype._eachCoin = function(callback) {
	for (var i = 0; i < ScratchVendingMachineGUI.prototype.COIN_COUNT; i++) {
		callback(this.elem.coins[i]);
	}
};


/**
 * Inserts gui into container.
 * @param {Object} container New gui container as DOM element.
 */
ScratchVendingMachineGUI.prototype.container = function(container) {
	this.elem.container = container;
	this.elem.container.appendChild(this.elem.gui);
};

/**
 * Sets the currency display.
 * @param {number} currency New container within SVM.
 */
ScratchVendingMachineGUI.prototype.currency = function(currency) {
	this.elem.currency.textContent = currency.toFixed(2);
};

/**
 * Shows refund.
 */
ScratchVendingMachineGUI.prototype.refund = function() {
	this.elem.refund.className = 'svm_refund svm_refunding';
};

/**
 * Removes refund.
 */
ScratchVendingMachineGUI.prototype.takeRefund = function() {
	this.elem.refund.className = 'svm_refund';
};

/**
 * Sets the state display.
 * @param {number} state State value
 */
ScratchVendingMachineGUI.prototype.state = function(state) {
	this.elem.state.textContent = state;
};

/**
 * Displays a question and passes the answer to a callback function.
 * @param {string} Question Prompt to show user.
 * @param {askCallback} callback Called after an answer is supplied.
 */
ScratchVendingMachineGUI.prototype.ask = function(question, callback) {
	var self = this;

	self.elem.input.value = '';

	self._answerHandler = function() {
		callback(self.elem.input.value);
	};

	self.elem.question.textContent = question;
	self.elem.prompt.style.display = 'block';
};

/**
 * Gives the user a message.
 * @param {string} message Prompt to show user.
 */
ScratchVendingMachineGUI.prototype.say = function(message) {
	var self = this;

	if (message) {
		// Show message
		self.elem.question.textContent = message;
		self.elem.answer.style.display = 'none';
		self.elem.prompt.style.display = 'block';
	}
	else {
		// Hide message
		self.elem.prompt.style.display = '';
		self.elem.answer.style.display = '';
	}
};

/**
 * Sets slot info.
 * @param {number} index Slot index starting at 0.
 * @param {Object} slot Slot object.
 * @param {Object} slot.src Image source of slot item.
 * @param {Object} slot.count Number of items in slot.
 * @param {Object} slot.name Slot label text.
 * @param {Object} slot.price Slot price
 */
ScratchVendingMachineGUI.prototype.slot = function(index, slot) {
	this.elem.slotCount[index].textContent = slot.count;
	this.elem.slotImage[index].setAttribute('src', slot.src);
	this.elem.slotName[index].textContent = slot.name;
	this.elem.slotPrice[index].textContent = '$' + slot.price.toFixed(2);
};

/**
 * Assigns a callback function to a slot click event.
 * @param {clickCallback} [callback] Slot click event callback.
 */
ScratchVendingMachineGUI.prototype.slotAction = function(callback) {
	var self = this;

	// Remove previous click event
	if (self._slotEventCallback) { 
		self._eachSlot.call(this, function(slot) {
			slot.removeEventListener('click', self._slotEventCallback);
		});
	}

	// Create new click event
	self._slotEventCallback = function(e) {
		if (!e.target.disabled) {
			callback(parseInt(e.target.value));
		}
	};

	// Add click event to slots
	self._eachSlot.call(this, function(slot) {
		slot.addEventListener('click', self._slotEventCallback);
	});
};

/**
 * Assigns a callback function to a refund button click event.
 * @param {clickCallback} [callback] Refund button click event callback.
 */
ScratchVendingMachineGUI.prototype.refundAction = function(callback) {
	// Remove previous click event
	if (this._refundEventCallback) { 
		this.elem.refundBtn.removeEventListener('click', this._refundEventCallback);
	}

	this._refundEventCallback = function(e) {
		if (!e.target.disabled) {
			callback();
		}
	};

	// Add new click event
	this.elem.refundBtn.addEventListener('click', this._refundEventCallback);
};

/**
 * Assigns a callback function to coin insertion.
 * @param {clickCallback} [callback] Insert event callback. Passed coin value.
 */
ScratchVendingMachineGUI.prototype.insertAction = function(callback) {
	var self = this;

	// Remove previous click event
	if (self._insertEventCallback) { 
		self._eachCoin.call(this, function(coin) {
			coin.removeEventListener('click', self._insertEventCallback);
		});
	}

	// Create new click event
	self._insertEventCallback = function(e) {
		if (!e.target.disabled) {
			callback(parseInt(e.target.value) / 100);
		}
	};

	// Add click event to coins
	self._eachCoin.call(this, function(coin) {
		coin.addEventListener('click', self._insertEventCallback);
	});
};

/**
 * Assigns a callback function to a dispenser
 * @param {clickCallback} [callback] Dispenser item click event callback.
 */
ScratchVendingMachineGUI.prototype.dispenserAction = function(callback) {
	// Remove previous click event
	if (this._dispenserEventCallback) { 
		this.elem.dispenserItem.removeEventListener('click', this._dispenserEventCallback);
	}

	this._dispenserEventCallback = function(e) {
		if (!e.target.disabled) {
			callback();
		}
	};

	// Add new click event
	this.elem.dispenserItem.addEventListener('click', this._dispenserEventCallback);
};

/**
 * Assigns a callback function to a refund
 * @param {clickCallback} [callback] Refund click event callback.
 */
ScratchVendingMachineGUI.prototype.takeRefundAction = function(callback) {
	// Remove previous click event
	if (this._takeRefundEventCallback) { 
		this.elem.refundMoney.removeEventListener('click', this._takeRefundEventCallback);
	}

	this._takeRefundEventCallback = function(e) {
		if (!e.target.disabled) {
			callback();
		}
	};

	// Add new click event
	this.elem.refundMoney.addEventListener('click', this._takeRefundEventCallback);
};

/**
 * Shows a dispense action
 * @param {string} src Image to dispense.
 */
ScratchVendingMachineGUI.prototype.dispense = function(src) {
	// Show image
	this.elem.dispenserItem.setAttribute('src', src);
	this.elem.dispenser.className = 'svm_dispenser svm_dispensing';
};

/**
 * Removes an item from the dispenser.
 */
ScratchVendingMachineGUI.prototype.takeItem = function() {
	this.elem.dispenser.className = 'svm_dispenser';
};
