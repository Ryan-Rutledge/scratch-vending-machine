/******************************
 * Vendimg Machine GUI
 *****************************/

/**
 * Displays vending machine gui.
 * @class
 */
function ScratchVendingMachineGUI() {
	var self = this;
	var gui = ScratchVendingMachineGUI.prototype.TEMPLATE.cloneNode(true);
	self.elem = {
		gui: gui,
		state: gui.getElementsByClassName('svm_state')[0],
		input: gui.getElementsByClassName('svm_input')[0],
		money: gui.getElementsByClassName('svm_money')[0],
		answer: gui.getElementsByClassName('svm_answer_box')[0],
		prompt: gui.getElementsByClassName('svm_prompt')[0],
		submit: gui.getElementsByClassName('svm_submit')[0],
		refund: gui.getElementsByClassName('svm_refund')[0],
		question: gui.getElementsByClassName('svm_question')[0],
		currency: gui.getElementsByClassName('svm_currency')[0],
		dispenser: gui.getElementsByClassName('svm_dispenser')[0],
		dispenserItem: gui.getElementsByClassName('svm_dispenser_img')[0],
		slots: gui.getElementsByClassName('svm_slot_button'),
		slotName: gui.getElementsByClassName('svm_slot_name'),
		slotImage: gui.getElementsByClassName('svm_slot_img'),
		slotCount: gui.getElementsByClassName('svm_slot_count'),
		slotPrice: gui.getElementsByClassName('svm_slot_price')
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
ScratchVendingMachineGUI.prototype.TEMPLATE = document.createElement('div');
ScratchVendingMachineGUI.prototype.TEMPLATE.className = 'svm_container';
ScratchVendingMachineGUI.prototype.TEMPLATE.innerHTML = 
	'<div class="svm_container">' +
	'	<span class="svm_state"></span>' +
	'	<div class="svm_vending_machine">' +
	'		<div class="svm_inner_container">' +
	'			<ul class="svm_slot_list">' +
	'				<li class="svm_slot">' +
	'					<button class="svm_slot_0 svm_slot_button" value="0">' +
	'						<img class="svm_slot_img">' +
	'						<span class="svm_slot_name">Coco Cola</span>' +
'							<span class="svm_slot_count"></span>' +
'							<br />' +
'							<span class="svm_slot_price"></span>' +
	'					</button>' +
	'				</li>' +
	'				<li class="svm_slot">' +
	'					<button class="svm_slot_1 svm_slot_button" value="1">' +
	'						<img class="svm_slot_img">' +
	'						<span class="svm_slot_name">Mountain Dew</span>' +
	'						<span class="svm_slot_count"></span>' +
	'						<br />' +
	'						<span class="svm_slot_price"></span>' +
	'					</button>' +
	'				</li>' +
	'				<li class="svm_slot">' +
	'					<button class="svm_slot_2 svm_slot_button" value="2">' +
	'						<img class="svm_slot_img">' +
	'						<span class="svm_slot_name"></span>' +
	'						<span class="svm_slot_count"></span>' +
	'						<br />' +
	'						<span class="svm_slot_price"></span>' +
	'					</button>' +
	'				</li>' +
	'			</ul>' +
	'			<div class="svm_aside">' +
	'				<div class="svm_display">' +
	'					$<span class="svm_currency">0.00</span>' +
	'				</div>' +
	'				<ul class="svm_keypad">' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'					<li class="svm_keypad_key"></li>' +
	'				</ul>' +
	'				<div class="svm_refund">' +
	'					<div class="svm_money"></div>' +
	'				</div>' +
	'			</div>' +
	'			<div class="svm_footer">' +
	'				<div class="svm_dispenser">' +
	'					<img class="svm_dispenser_img"/>' +
	'               </div>' +
	'			</div>' +
	'		</div>' +
	'	</div>' +
	'	<div class="svm_prompt">' +
	'		<label class="svm_question"></label>' +
	'		<div class="svm_answer_box">' +
	'			<br />' +
	'			<input class="svm_input" />' +
	'			<button class="svm_submit" />Enter</button>' +
	'		</div>' +
	'	</div>' +
	'</div>';

/**
 * Applies a function to all slot elements.
 * @private
 * @param {function} action.- Action to do to each slot. Passed elem.
 */
ScratchVendingMachineGUI.prototype._eachSlot = function(callback) {
	for (var i = 0; i < ScratchVendingMachineGUI.prototype.SLOT_COUNT; i++) {
		callback(this.elem.slots[i]);
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
 * @param {function} [callback] Called after answer goes away.
 */
ScratchVendingMachineGUI.prototype.say = function(message, callback) {
	var self = this;

	self.elem.question.textContent = message;
	self.elem.answer.style.display = 'none';
	self.elem.prompt.style.display = 'block';

	setTimeout(function() {
		self.elem.prompt.style.display = '';
		self.elem.answer.style.display = '';
		if (callback) callback();
	}, ScratchVendingMachineGUI.prototype.ANIMATE_TIMEOUT);
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
 * @param {clickCallback} callback Slot click event callback.
 */
ScratchVendingMachineGUI.prototype.slotClick = function(callback) {
	var self = this;

	// Remove previous click event
	if (self._slotClickEvent) { 
		self._eachSlot.call(this, function(slot) {
			slot.removeEventListener('click', self._slotClickEvent);
		});
	}

	self._slotClickEvent = function(e) {
		if (!e.target.disabled) {
			callback(parseInt(e.target.value));
		}
	};

	// Add new click event
	self._eachSlot.call(this, function(slot) {
		slot.addEventListener('click', self._slotClickEvent);
	});
};

/**
 * Disables or enables slot click listeners.
 * @param {boolean} disable If true, slots will be disabled. Otherwise,
 *   slots will listen for click events.
 */
ScratchVendingMachineGUI.prototype.disableSlotClick = function(disable) {
	this._eachSlot(function(slot) {
		slot.disabled = disable;
	});
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
