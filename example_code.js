function scratchLogicLoop(svm) {
	switch (svm.state()) {
		case 'A':
			svm.say('Insert coins or click refund');

			switch(svm.reply()) {
				case 'refund':
					if (svm.currency() > 0) {
						svm.state('D');
					}
					break;
				default:
					svm.currency(svm.currency() + (parseFloat(svm.reply()) || 0));

					if (svm.currency() >= 1.25) {
						svm.state('B');
					}
					break;
			}
			break;
		case 'B':
			svm.say("Select a soda or click refund.");

			switch (svm.reply()) {
				case 'refund':
					svm.state('D');
					break;
				case 'soda':
					var soda = svm.clicked();
					if (soda && soda.count !== undefined && soda.count > 0) {
						svm.slot(soda.index, soda.count - 1);
						svm.dispense(soda.index);
						svm.currency(svm.currency() - 1.25);
						svm.state('C');
					}
					else {
						svm.say('Not available');
					}
					break;
			}
			break;
		case 'C':
			svm.say('Dispensing soda. Please remove soda from dispenser.');

			if (svm.reply() === 'dispense') {
				svm.takeItem();

				if (svm.currency() > 0) {
					svm.state('D');
				}
				else {
					svm.state('A');
				}
			}
			break;
		case 'D':
			var currency = svm.currency();
			svm.say('Returning $' + currency.toFixed(2) + ' in change. Please remove change.');
			svm.refund(currency);
			svm.state('E');
			break;
		case 'E':
			if (svm.reply() === 'cash') {
				svm.say();
				svm.takeRefund();
				svm.state('A');
			}
			break;
	}
}

function createSVM() {
	// Get DOM container for svm gui
	var container = document.getElementById('vmContainer');
	
	// Create new SVM object
	svm = new ScratchVendingMachine(container)
		.slot(0, 5, 'Cola', './cola.png', 1.25)
		.slot(1, 9, 'Ginger Ale', 'gingerale.png', 1.25)
		.slot(2, 4, 'Root Beer', './rootbeer.png', 1.25)
		.loop(scratchLogicLoop) // Set logic loop
		.state('A'); // Begin loop at state A
}
